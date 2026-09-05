"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { useTranslations } from "next-intl";
import { sendContact } from "@/app/actions/contact";
import {
  CONTACT_LIMITS,
  initialContactState,
  type ContactField,
} from "@/lib/contact-types";
import Rounded from "../../common/RoundedButton/RoundedButton";
import styles from "./ContactForm.module.scss";

const EMAIL = "guevaraeu1@gmail.com";
const MAILTO = `mailto:${EMAIL}?subject=Portfolio%20Contact&body=Hi%20Eugenio,`;

export default function ContactForm() {
  const t = useTranslations("Contact.form");
  const id = useId();
  const [state, formAction, pending] = useActionState(
    sendContact,
    initialContactState,
  );

  // Stamped on mount (client only, so no hydration mismatch) and re-attached
  // to every submission; a hidden input would be wiped by React's form reset.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  // Re-stamp on the first edit after an error so a tab left open for more
  // than MAX_FORM_AGE_MS can still submit without a reload.
  const restamp = () => {
    if (Date.now() - startedAt.current > 60_000) startedAt.current = Date.now();
  };

  // After the action settles, move keyboard focus to the first invalid field
  // or, failing that, to the status message, so sighted keyboard users don't
  // lose their place (the live region only reaches screen readers).
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.status === "idle") return;
    const invalid = formRef.current?.querySelector<HTMLElement>(
      '[aria-invalid="true"]',
    );
    (invalid ?? statusRef.current)?.focus();
  }, [state]);

  const submit = (formData: FormData) => {
    formData.set("startedAt", String(startedAt.current));
    formAction(formData);
  };

  const error = state.status === "error" ? state : null;
  const values = error?.values;
  const fieldError = (name: ContactField) =>
    error?.fieldErrors?.[name] ? t(`errors.${name}`) : null;
  const showDirectEmail =
    error?.code === "notConfigured" || error?.code === "sendFailed";

  const fields: {
    name: ContactField;
    type: "text" | "email" | "textarea";
    autoComplete: string;
  }[] = [
    { name: "name", type: "text", autoComplete: "name" },
    { name: "email", type: "email", autoComplete: "email" },
    { name: "message", type: "textarea", autoComplete: "off" },
  ];

  return (
    <section className={styles.formSection} aria-labelledby={`${id}-title`}>
      <div className={styles.intro}>
        <h3 id={`${id}-title`} className={styles.title}>
          {t("title")}
        </h3>
        <p className={styles.lead}>{t("intro")}</p>
      </div>

      {/* noValidate: the server action validates and returns translated
          messages; native bubbles would be in the browser's UI language. */}
      <form onInput={restamp}
        ref={formRef}
        action={submit}
        className={styles.form}
        noValidate
        aria-busy={pending}
      >
        {fields.map(({ name, type, autoComplete }) => {
          const fieldId = `${id}-${name}`;
          const errorId = `${fieldId}-error`;
          const message = fieldError(name);
          // readOnly (not disabled) while pending: a disabled control drops
          // keyboard focus to <body>.
          const shared = {
            id: fieldId,
            name,
            autoComplete,
            required: true,
            defaultValue: values?.[name] ?? "",
            placeholder: t(`${name}Placeholder`),
            "aria-invalid": message ? true : undefined,
            "aria-describedby": message ? errorId : undefined,
            className: styles.input,
            readOnly: pending,
          };
          return (
            <div
              key={name}
              className={`${styles.field} ${
                type === "textarea" ? styles.fieldFull : ""
              }`}
            >
              <label htmlFor={fieldId} className={styles.label}>
                {t(name)}
              </label>
              {type === "textarea" ? (
                <textarea
                  {...shared}
                  rows={5}
                  minLength={CONTACT_LIMITS.message.min}
                  maxLength={CONTACT_LIMITS.message.max}
                />
              ) : (
                <input
                  {...shared}
                  type={type}
                  minLength={
                    name === "name" ? CONTACT_LIMITS.name.min : undefined
                  }
                  maxLength={
                    name === "name"
                      ? CONTACT_LIMITS.name.max
                      : CONTACT_LIMITS.email.max
                  }
                />
              )}
              {message && (
                <p id={errorId} className={styles.fieldError}>
                  {message}
                </p>
              )}
            </div>
          );
        })}

        {/* Honeypot: off-screen, not in the tab order, ignored by assistive
            tech. The name is one browser autofill has no heuristic for (a
            "company"/organization field can be populated by address autofill
            and would silently drop a real message). */}
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor={`${id}-extra`}>Leave this field empty</label>
          <input
            id={`${id}-extra`}
            type="text"
            name="contact_extra"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        <div className={styles.actions}>
          <Rounded
            as="button"
            type="submit"
            disabled={pending}
            aria-disabled={pending}
            backgroundColor="#fb7b45"
            className={styles.submit}
          >
            {/* span: <button> only allows phrasing content. */}
            <span className={styles.submitLabel}>
              {pending ? t("sending") : t("submit")}
            </span>
          </Rounded>

          <div
            ref={statusRef}
            tabIndex={-1}
            className={styles.status}
            role="status"
            aria-live="polite"
          >
            {state.status === "success" && (
              <p className={styles.success}>{t("success")}</p>
            )}
            {error && (
              <p className={styles.error}>
                {t(`errors.${error.code}`)}
                {showDirectEmail && (
                  <>
                    {" "}
                    <a href={MAILTO} className={styles.mailLink}>
                      {EMAIL}
                    </a>
                  </>
                )}
              </p>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}
