import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const SITE_URL = "https://www.eugenioguevara.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // One <url> entry per locale, each carrying the full hreflang cluster.
  const languages = {
    en: `${SITE_URL}/en`,
    es: `${SITE_URL}/es`,
    "x-default": `${SITE_URL}/en`,
  };

  return routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified,
    changeFrequency: "weekly",
    priority: locale === routing.defaultLocale ? 1 : 0.9,
    alternates: { languages },
  }));
}
