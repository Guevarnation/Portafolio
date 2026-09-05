import "server-only";
import { z } from "zod";
import { CONTACT_LIMITS, type ContactField } from "./contact-types";

/**
 * Authoritative validation for the contact form, used only by the server
 * action. `server-only` makes any client import a build error: zod is ~110 KB
 * gzipped and must never be shipped to the browser (the client mirrors the
 * limits via CONTACT_LIMITS from contact-types.ts). Error messages are keys
 * under `Contact.form.errors` in messages/*.json; the client translates them,
 * so the action never needs the request locale.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.name.min, "name")
    .max(CONTACT_LIMITS.name.max, "name")
    // The name is interpolated into the email subject; no header injection.
    .regex(/^[^\r\n]*$/, "name"),
  email: z.email("email").trim().max(CONTACT_LIMITS.email.max, "email"),
  message: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.message.min, "message")
    .max(CONTACT_LIMITS.message.max, "message"),
} satisfies Record<ContactField, z.ZodType>);

export type ContactInput = z.infer<typeof contactSchema>;
