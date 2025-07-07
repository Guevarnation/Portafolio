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
    "Full-stack developer specializing in React, Next.js, React Native, and AI/RAG systems. Building modern web applications, mobile apps, and blockchain solutions.",
  keywords: [
    "full-stack developer",
    "react developer",
    "next.js developer",
    "react native developer",
    "software engineer",
    "web developer",
    "mobile app developer",
    "AI developer",
    "blockchain developer",
    "freelance developer",
    "economist",
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
    title: "Eugenio Guevara - Full-Stack Developer & Economist",
    description:
      "Full-stack developer building modern web applications, mobile apps, and AI systems. Experienced in React, Next.js, React Native, and blockchain development.",
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
    title: "Eugenio Guevara - Full-Stack Developer",
    description:
      "Full-stack developer specializing in React, Next.js, React Native, and AI systems.",
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
                  "Full-stack developer specializing in React, Next.js, React Native, and AI/RAG systems",
                url: "https://eugenioguevara.com",
                sameAs: [
                  "https://github.com/Guevarnation",
                  "https://www.linkedin.com/in/eugenio-guevara-a8417b20b/",
                ],
                knowsAbout: [
                  "React",
                  "Next.js",
                  "React Native",
                  "JavaScript",
                  "TypeScript",
                  "Full-Stack Development",
                  "Mobile App Development",
                  "AI Development",
                  "Blockchain Development",
                ],
                alumniOf: "Software Engineering",
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
                  "Full-stack developer portfolio showcasing React, Next.js, React Native, and AI projects",
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
