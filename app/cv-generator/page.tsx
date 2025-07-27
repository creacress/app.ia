"use client";
import React from "react";
import { FaFileAlt } from "react-icons/fa";
import SuiviPage from "@/components/SuiviPage";
import CookieConsent from "@/components/CookieConsent";

export default function CvGeneratorComingSoon() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-zinc-900 via-black to-zinc-800 text-white text-center">
      <SuiviPage />
      <CookieConsent />
      <div className="animate-pulse-slow text-indigo-500 text-6xl mb-6">
        <FaFileAlt className="inline-block" />
      </div>
      <h1 className="text-4xl font-bold mb-4 animate-fade-in">Générateur de CV en construction</h1>
      <p className="text-lg text-gray-400 max-w-xl animate-fade-in delay-200">
        Cette fonctionnalité arrive bientôt ! Notre IA prépare des CV parfaits rien que pour vous 📄✨
      </p>
      <div className="mt-10">
        <div className="w-40 h-40 rounded-full border-4 border-indigo-500 border-dashed animate-spin" />
      </div>
    </main>
  );
}