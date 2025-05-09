import { getRequestConfig } from "next-intl/server";

const locales = ["en", "es"];
const defaultLocale = "en";

export default getRequestConfig(async ({ locale }) => {
  // Use defaultLocale if locale is undefined
  const resolvedLocale = locale || defaultLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(resolvedLocale as string)) {
    throw new Error(`Locale ${resolvedLocale} not supported`);
  }

  return {
    locale: resolvedLocale as string,
    messages: (await import(`../../messages/${resolvedLocale}.json`)).default,
  };
});
