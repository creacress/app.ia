

"use client";
import React from "react";
import { FaCompress } from "react-icons/fa";

export default function ImageCompressorComingSoon() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-zinc-900 via-black to-zinc-800 text-white text-center">
      <div className="animate-pulse-slow text-indigo-500 text-6xl mb-6">
        <FaCompress className="inline-block" />
      </div>
      <h1 className="text-4xl font-bold mb-4 animate-fade-in">Compresseur d’images en construction</h1>
      <p className="text-lg text-gray-400 max-w-xl animate-fade-in delay-200">
        Cette fonctionnalité arrive bientôt ! Notre IA compressera vos images sans perte de qualité 📷✨
      </p>
      <div className="mt-10">
        <div className="w-40 h-40 rounded-full border-4 border-indigo-500 border-dashed animate-spin" />
      </div>
    </main>
  );
}