import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eugenio Guevara",
  description: "Eugenio Guevara's personal website",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<RootLayoutProps>) {
  // In Next.js 15, we need to ensure the params are resolved before using them
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;

  // Pass the locale to getMessages
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <html lang={locale}>
        <body className={inter.className}>
          <Header />
          {children}
        </body>
      </html>
    </NextIntlClientProvider>
  );
}
