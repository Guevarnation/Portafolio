import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://eugenioguevara.com";
  //   const isProduction = process.env.NODE_ENV === "production";

  //   // Block everything in development/staging
  //   if (!isProduction) {
  //     return {
  //       rules: {
  //         userAgent: "*",
  //         disallow: "/",
  //       },
  //       sitemap: `${baseUrl}/sitemap.xml`,
  //     };
  //   }

  // Production rules
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/", // Block API endpoints if any
          "/_next/", // Block Next.js internals
          "/_vercel/", // Block Vercel internals
          "/admin/", // Block any admin areas
        ],
        crawlDelay: 1, // Be respectful to your server
      },
      // Give Google special treatment (no crawl delay)
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/_next/", "/_vercel/", "/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
