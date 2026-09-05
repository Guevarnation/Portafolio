import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { preconnect } from "react-dom";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { localeUrl, routing, SITE_URL } from "@/i18n/routing";
import Header from "@/components/Header";
import MotionProvider from "@/components/MotionProvider/MotionProvider";
import { IntroProvider } from "@/components/IntroOverlay/IntroContext";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Project posters and videos (below the fold) are served from Cloudinary. */
const MEDIA_ORIGIN = "https://res.cloudinary.com";

/**
 * Runs synchronously in <head>, before the intro overlay is painted. Keep the
 * session key in sync with IntroOverlay.tsx and the attribute with the
 * `html[data-intro="skip"]` rule in globals.css.
 */
const INTRO_SKIP_SCRIPT =
  '(function(){try{if(sessionStorage.getItem("intro-seen")==="1"||' +
  'matchMedia("(prefers-reduced-motion: reduce)").matches){' +
  'document.documentElement.setAttribute("data-intro","skip")}}catch(e){}})();';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const ogLocale = locale === "es" ? "es_ES" : "en_US";
  const altLocale = locale === "es" ? "en_US" : "es_ES";
  // English is unprefixed ("/"), Spanish is "/es" (routing.localePrefix).
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, localeUrl(l)])
  );
  languages["x-default"] = localeUrl(routing.defaultLocale);

  return {
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: "Eugenio Guevara | Full-Stack Developer & Economist",
    template: "%s | Eugenio Guevara",
  },
  description:
    "AWS Certified Full-Stack Developer building production apps for US agencies and fintech startups. Specializing in TypeScript, Go, React Native, AI pipelines, and cloud-native architectures.",
  keywords: [
    "full-stack developer",
    "react developer",
    "next.js developer",
    "react native developer",
    "software engineer",
    "web developer",
    "mobile app developer",
    "AI developer",
    "Go developer",
    "AWS certified solutions architect",
    "fintech developer",
    "cloud architect",
    "TypeScript developer",
    "RAG pipeline",
  ],
  authors: [{ name: "Eugenio Guevara" }],
  creator: "Eugenio Guevara",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: ogLocale,
    alternateLocale: altLocale,
    url: localeUrl(locale),
    title: "Eugenio Guevara - AWS Certified Full-Stack Developer",
    description:
      "AWS Certified Full-Stack Developer building production apps for US agencies and fintech startups. TypeScript, Go, React Native, AI pipelines, and cloud-native architectures.",
    siteName: "Eugenio Guevara Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eugenio Guevara - AWS Certified Full-Stack Developer",
    description:
      "AWS Certified Full-Stack Developer. TypeScript, Go, React Native, AI pipelines, and cloud-native architectures.",
  },
  alternates: {
    canonical: localeUrl(locale),
    languages,
  },
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  // Resolved from the `[locale]` root param inside src/i18n/request.ts, which
  // validates it and 404s on unknown values. Static rendering is preserved
  // without setRequestLocale (deprecated in next-intl 4.13.5).
  const locale = await getLocale();

  // Resource hint for the media CDN, emitted into <head> by React (the
  // Metadata API has no field for it; see generate-metadata.md). preconnect
  // subsumes dns-prefetch; React drops a prefetchDNS for the same origin.
  preconnect(MEDIA_ORIGIN);

  const inLanguage = locale === "es" ? "es-ES" : "en-US";

  return (
    <NextIntlClientProvider>
      {/* suppressHydrationWarning: the inline script below may add
          data-intro="skip" to <html> before React hydrates. */}
      <html lang={locale} suppressHydrationWarning>
        <head>
          <script dangerouslySetInnerHTML={{ __html: INTRO_SKIP_SCRIPT }} />
          {/* Structured Data for Personal Portfolio */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": `${SITE_URL}/#person`,
                name: "Eugenio Guevara",
                jobTitle: "Full-Stack Developer",
                description:
                  "AWS Certified Full-Stack Developer building production apps for US agencies and fintech startups",
                url: SITE_URL,
                sameAs: [
                  "https://github.com/Guevarnation",
                  "https://www.linkedin.com/in/eugenio-guevara-a8417b20b/",
                ],
                knowsAbout: [
                  "React",
                  "Next.js",
                  "React Native",
                  "TypeScript",
                  "Go",
                  "AWS",
                  "Full-Stack Development",
                  "Mobile App Development",
                  "AI/RAG Pipelines",
                  "Cloud Architecture",
                  "Fintech",
                ],
                worksFor: {
                  "@type": "Organization",
                  name: "SEM Nexus",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "New York",
                    addressRegion: "NY",
                    addressCountry: "US",
                  },
                },
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Monterrey",
                  addressCountry: "MX",
                },
                alumniOf: {
                  "@type": "CollegeOrUniversity",
                  name: "University of Monterrey (UDEM)",
                },
                hasCredential: {
                  "@type": "EducationalOccupationalCredential",
                  name: "AWS Certified Solutions Architect – Associate (SAA-C03)",
                  credentialCategory: "Professional Certification",
                },
                email: "guevaraeu1@gmail.com",
              }),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                url: SITE_URL,
                name: "Eugenio Guevara Portfolio",
                description:
                  "AWS Certified Full-Stack Developer portfolio showcasing AI pipelines, real-time systems, and mobile apps",
                author: {
                  "@id": `${SITE_URL}/#person`,
                },
                inLanguage,
              }),
            }}
          />
        </head>
        <body className={inter.className}>
          <MotionProvider>
            <IntroProvider>
              <Header />
              {children}
            </IntroProvider>
          </MotionProvider>
          <Analytics />
        </body>
      </html>
    </NextIntlClientProvider>
  );
}
