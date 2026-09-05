import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  // English lives at "/" and Spanish at "/es". A request for "/en/..." is
  // 307-redirected to the unprefixed path by the proxy, so the apex -> www
  // hop on Vercel is the only redirect a first visit pays.
  localePrefix: "as-needed",
  // The HTML already carries the full hreflang cluster (layout metadata);
  // the middleware's Link header duplicated it with a different x-default.
  alternateLinks: false,
});

export const SITE_URL = "https://www.eugenioguevara.com";

/**
 * Canonical absolute URL of a locale's home. The default locale is the bare
 * origin (no trailing slash) so canonical, hreflang, og:url, sitemap and
 * JSON-LD all spell it identically (Next strips the slash in metadata anyway).
 */
export function localeUrl(locale: string): string {
  return locale === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${locale}`;
}
