import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export const metadata: Metadata = {
  metadataBase: new URL("https://eugenioguevara.com/"),
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
    locale: "en_US",
    url: "https://eugenioguevara.com",
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
    canonical: "https://eugenioguevara.com",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
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
                inLanguage: "en-US",
              }),
            }}
          />
        </head>
        <body className={inter.className}>
          <Header />
          {children}
          <Analytics />
        </body>
      </html>
    </NextIntlClientProvider>
  );
}
