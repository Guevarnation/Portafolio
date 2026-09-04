import { locale as rootLocale } from "next/root-params";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "./routing";

// Next 16.3 root params replace the deprecated `requestLocale` (next-intl
// 4.13.5+). The `[locale]` segment acts as a catch-all for unknown paths that
// bypass the proxy matcher (e.g. /foo.txt), so invalid values 404 here.
export default getRequestConfig(async () => {
  const requested = await rootLocale();
  if (!hasLocale(routing.locales, requested)) notFound();
  const locale = requested;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
