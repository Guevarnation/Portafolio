import { notFound } from "next/navigation";

/**
 * Catch-all under the locale segment so unknown paths like /whatever or /es/whatever
 * render the localized app/[locale]/not-found.tsx inside the locale layout
 * (per next-intl's error-files guide). Paths with an invalid locale still
 * fall through to Next's default 404 from i18n/request.ts.
 */
export default function CatchAll() {
  notFound();
}
