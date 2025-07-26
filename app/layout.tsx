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
  title: "microgenie.app – IA utiles au quotidien",
  description:
    "microgenie.app propose des microservices gratuits et instantanés pour booster ta productivité grâce à l'IA : résumé de PDF, LinkedIn, Excel, fiches, images, CV.",
};

import Link from "next/link";
import Head from "next/head";
import CookieConsent from "../components/CookieConsent";

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
        <CookieConsent />
        {children}
      </body>
    </html>
  );
}
