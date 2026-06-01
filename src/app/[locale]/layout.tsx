import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import MotionProvider from "@/components/MotionProvider/MotionProvider";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const SITE_URL = "https://eugenioguevara.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const ogLocale = locale === "es" ? "es_ES" : "en_US";
  const altLocale = locale === "es" ? "en_US" : "es_ES";

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
    url: `${SITE_URL}/${locale}`,
    title: "Eugenio Guevara - AWS Certified Full-Stack Developer",
    description:
      "AWS Certified Full-Stack Developer building production apps for US agencies and fintech startups. TypeScript, Go, React Native, AI pipelines, and cloud-native architectures.",
    images: [
      {
        url: "/images/background.jpeg",
        width: 1200,
        height: 630,
        alt: "Eugenio Guevara - Full-Stack Developer Portfolio",
      },
    ],
    siteName: "Eugenio Guevara Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eugenio Guevara - AWS Certified Full-Stack Developer",
    description:
      "AWS Certified Full-Stack Developer. TypeScript, Go, React Native, AI pipelines, and cloud-native architectures.",
    images: ["/images/background.jpeg"],
  },
  alternates: {
    canonical: `${SITE_URL}/${locale}`,
    languages: {
      en: `${SITE_URL}/en`,
      es: `${SITE_URL}/es`,
      "x-default": `${SITE_URL}/en`,
    },
  },
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enables static rendering for this locale.
  setRequestLocale(locale);

  const inLanguage = locale === "es" ? "es-ES" : "en-US";

  return (
    <NextIntlClientProvider>
      <html lang={locale}>
        <head>
          {/* Structured Data for Personal Portfolio */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": "https://eugenioguevara.com/#person",
                name: "Eugenio Guevara",
                jobTitle: "Full-Stack Developer",
                description:
                  "AWS Certified Full-Stack Developer building production apps for US agencies and fintech startups",
                url: "https://eugenioguevara.com",
                sameAs: [
                  "https://github.com/Guevarnation",
                  "https://www.linkedin.com/in/eugenio-guevara",
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
                "@id": "https://eugenioguevara.com/#website",
                url: "https://eugenioguevara.com",
                name: "Eugenio Guevara Portfolio",
                description:
                  "AWS Certified Full-Stack Developer portfolio showcasing AI pipelines, real-time systems, and mobile apps",
                author: {
                  "@id": "https://eugenioguevara.com/#person",
                },
                inLanguage,
              }),
            }}
          />
        </head>
        <body className={inter.className}>
          <MotionProvider>
            <Header />
            {children}
          </MotionProvider>
          <Analytics />
        </body>
      </html>
    </NextIntlClientProvider>
  );
}
