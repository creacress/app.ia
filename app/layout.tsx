import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "microgenie.app – Outils PDF en ligne gratuits et simples",
  description:
    "Outils PDF gratuits : résumé, compression, conversion. Sans pub, sans inscription. microgenie.app, une IA rapide et respectueuse de la vie privée.",
  keywords:
    "outil PDF, résumé PDF, compresseur PDF, convertir PDF, PDF gratuit, IA, microgenie",
  metadataBase: new URL("https://www.microgenie.app"),
  openGraph: {
    title: "microgenie.app – PDF & IA en ligne",
    description:
      "Utilise nos microservices PDF (compression, résumé, conversion, etc.) sans pub ni tracking.",
    url: "https://www.microgenie.app",
    siteName: "microgenie.app",
    type: "website",
  },
};

import Link from "next/link";
import Script from "next/script";

const Header = () => (
  <header className="w-full px-6 py-4 bg-black text-white border-b border-zinc-800 flex justify-between items-center">
    <Link href="/" className="text-xl font-bold tracking-tight">
      microgenie.app
    </Link>
    <nav className="hidden sm:flex gap-4 text-sm text-gray-400">
      <Link href="/pdf-summary">Résumé PDF</Link>
      <Link href="/pdf-compressor">Compressor PDF</Link>
      <Link href="/linkedin-post">Post LinkedIn</Link>
      <Link href="/convertisseur-images">Convertisseur Images</Link>
      <Link href="/excel-cleaner">Excel</Link>
      <Link href="/revision-cards">Fiches</Link>
      <Link href="/image-compressor">Images</Link>
      <Link href="/cv-generator">CV</Link>
    </nav>
  </header>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Only inject GA script if consent is given, using client-side check
  // Remove GA script from <Head>
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <Header />
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ETZGPHCT13"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ETZGPHCT13');
            `,
          }}
        />
      </body>
    </html>
  );
}
