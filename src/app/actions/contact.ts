"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";
import {
  MAX_FORM_AGE_MS,
  MIN_FILL_MS,
  type ContactField,
  type ContactState,
} from "@/lib/contact-types";

const TO = "guevaraeu1@gmail.com";
// Resend's onboarding sender can only deliver to the account owner's own
// address, which is exactly this case until eugenioguevara.com is verified.
const FROM = process.env.RESEND_FROM ?? "Portfolio <onboarding@resend.dev>";

// Best-effort per-IP limiter on *send attempts*: a client that gets past the
// honeypot and the fill-time check may trigger at most RATE_MAX Resend calls
// per RATE_WINDOW_MS from one warm instance. On Vercel this state is
// per-instance (not shared, not durable), so it caps burst abuse rather than
// guaranteeing a global ceiling; the durable control is a Vercel WAF
// rate-limit rule on POST — see .env.example.
const RATE_WINDOW_MS = 10 * 60_000;
const RATE_MAX = 5;
const sendAttempts = new Map<string, number[]>();

function isRateLimited(key: string, now: number): boolean {
  if (sendAttempts.size > 1_000) {
    for (const [k, stamps] of sendAttempts) {
      if (stamps.every((t) => now - t >= RATE_WINDOW_MS)) sendAttempts.delete(k);
    }
  }
  const recent = (sendAttempts.get(key) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS,
  );
  const limited = recent.length >= RATE_MAX;
  if (!limited) recent.push(now);
  sendAttempts.set(key, recent);
  return limited;
}

async function clientKey(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || h.get("x-real-ip") || "unknown";
}

const field = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
};

/**
 * Parses the client's mount timestamp. Only a 13-digit millisecond epoch is
 * accepted (so a missing field, "", "0" or garbage never passes), and the
 * form must be between MIN_FILL_MS and MAX_FORM_AGE_MS old. The value is
 * client-supplied and unsigned: this is a speed bump for naive bots, not a
 * proof of humanity.
 */
function formAge(formData: FormData, now: number): number {
  const raw = formData.get("startedAt");
  if (typeof raw !== "string" || !/^\d{13}$/.test(raw)) return NaN;
  return now - Number(raw);
}

/**
 * Server action for the contact form (`useActionState`). Never throws to the
 * client: every failure is returned as a translatable error code.
 */
export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const now = Date.now();
  // The action id is public, so a hand-crafted POST may omit the FormData
  // argument entirely; answer with an error instead of throwing a 500.
  if (!(formData instanceof FormData)) {
    return {
      status: "error",
      code: "invalid",
      values: { name: "", email: "", message: "" },
    };
  }
  const values: Record<ContactField, string> = {
    name: field(formData, "name"),
    email: field(formData, "email"),
    message: field(formData, "message"),
  };

  // Honeypot: real users never see or fill `contact_extra`. Pretend it worked
  // so bots get no signal, but leave a trace so silent drops are observable.
  if (field(formData, "contact_extra") !== "") {
    console.warn("[contact] honeypot hit; submission dropped");
    return { status: "success" };
  }

  // Minimum fill time: the client stamps when the form mounted.
  const age = formAge(formData, now);
  if (!Number.isFinite(age) || age < MIN_FILL_MS || age > MAX_FORM_AGE_MS) {
    return { status: "error", code: "tooFast", values };
  }

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, ContactField>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "name" || key === "email" || key === "message") {
        fieldErrors[key] = key;
      }
    }
    return { status: "error", code: "invalid", fieldErrors, values };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[contact] RESEND_API_KEY is not set; the contact form is disabled.",
    );
    return { status: "error", code: "notConfigured", values };
  }

  const key = await clientKey();
  if (isRateLimited(key, now)) {
    console.warn("[contact] rate limited a send attempt");
    return { status: "error", code: "rateLimited", values };
  }

  const { name, email, message } = parsed.data;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}\n`,
    });

    if (error) {
      console.error(`[contact] Resend error: ${error.name}: ${error.message}`);
      return { status: "error", code: "sendFailed", values };
    }
    return { status: "success" };
  } catch (err) {
    console.error(
      `[contact] send failed: ${err instanceof Error ? err.message : String(err)}`,
    );
    return { status: "error", code: "sendFailed", values };
  }
}
