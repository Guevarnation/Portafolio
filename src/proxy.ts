import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames. Metadata image routes are
  // excluded: with `localePrefix: "as-needed"` the proxy would 307
  // /en/opengraph-image (the URL Next puts in og:image) to /opengraph-image;
  // bypassing it lets the prerendered PNG answer directly.
  matcher: ["/((?!api|_next|_vercel|.*\\..*|.*opengraph-image$).*)"],
};
