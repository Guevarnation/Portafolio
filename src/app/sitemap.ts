import type { MetadataRoute } from "next";
import { localeUrl, routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // One <url> entry per locale, each carrying the full hreflang cluster.
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, localeUrl(locale)])
  );
  languages["x-default"] = localeUrl(routing.defaultLocale);

  return routing.locales.map((locale) => ({
    url: localeUrl(locale),
    lastModified,
    changeFrequency: "weekly",
    priority: locale === routing.defaultLocale ? 1 : 0.9,
    alternates: { languages },
  }));
}
