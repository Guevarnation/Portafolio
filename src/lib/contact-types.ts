/**
 * Contact form contract shared by the client island (ContactForm.tsx) and the
 * server action. Deliberately free of runtime dependencies: the zod schema
 * lives in contact-schema.ts (server-only) so the validator never reaches the
 * browser bundle.
 */
export const CONTACT_LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  message: { min: 10, max: 2000 },
} as const;

/** A human needs at least this long between mount and submit (anti-bot). */
export const MIN_FILL_MS = 3_000;

/** A form older than this (tab left open, replayed payload) is rejected. */
export const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;

export type ContactField = "name" | "email" | "message";

/** Error codes returned to the client; each maps to `Contact.form.errors.*`. */
export type ContactErrorCode =
  | ContactField
  | "invalid"
  | "tooFast"
  | "rateLimited"
  | "notConfigured"
  | "sendFailed";

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      code: ContactErrorCode;
      fieldErrors?: Partial<Record<ContactField, ContactField>>;
      /** Echoed back so the (auto-reset) form can repopulate its fields. */
      values: Record<ContactField, string>;
    };

export const initialContactState: ContactState = { status: "idle" };
