import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  // The HTML already carries the full hreflang cluster (layout metadata);
  // the middleware's Link header duplicated it with a different x-default.
  alternateLinks: false,
});
