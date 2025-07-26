

"use client";

import React, { useState, useRef, useEffect } from "react";

export const metadata = {
  title: "Contact – microgenie.app",
  description: "Besoin d'aide ou de nous contacter ? Retrouvez ici toutes les informations utiles pour réclamations, support ou collaboration.",
};

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const modalTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });
      if (res.ok) {
        setShowModal(true);
        setEmail("");
        setMessage("");
        modalTimerRef.current = setTimeout(() => setShowModal(false), 2200);
      } else {
        // Optionally, handle error
        alert("Erreur lors de l'envoi du message.");
      }
    } catch {
      alert("Erreur lors de l'envoi du message.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20 font-sans relative">
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-6 tracking-tight">
        Contact & Support
      </h1>
      <p className="text-center text-gray-300 max-w-2xl mx-auto mb-12">
        Une question ? Une réclamation ? Une suggestion ? Nous sommes là pour vous aider à tirer le meilleur parti de <span className="text-indigo-400 font-semibold">microgenie.app</span>.
      </p>

      <section className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Qui sommes-nous ?</h2>
        <p className="text-gray-400 leading-relaxed">
          microgenie.app est une plateforme proposant des outils IA gratuits et pratiques pour simplifier votre quotidien : résumé PDF, nettoyage Excel, conversion d’images, création de CV, etc.
        </p>
        <p className="text-gray-400 mt-4 leading-relaxed">
          Notre mission est de rendre l'intelligence artificielle accessible à tous, sans publicité, sans collecte de données, et sans frais cachés.
        </p>
      </section>

      <section className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Nous écrire</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">Adresse email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="message" className="block mb-1 text-sm font-medium">Message</label>
            <textarea
              id="message"
              rows={6}
              className="w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded transition duration-300"
            disabled={!email || !message}
          >
            Envoyer
          </button>
        </form>
      </section>

      <section className="max-w-3xl mx-auto mt-16 text-gray-400 text-sm">
        <h2 className="text-lg font-semibold mb-2 text-indigo-400">Informations pratiques</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Support : <a href="mailto:support@microgenie.app" className="text-indigo-300 underline hover:text-indigo-400">contact@webcresson.com</a></li>
          <li>Collaborations & partenariats : <a href="mailto:hello@microgenie.app" className="text-indigo-300 underline hover:text-indigo-400">contact@webcresson.com</a></li>
          <li>Temps de réponse : sous 48h ouvrées</li>
          <li>Suivez-nous sur <a href="https://www.linkedin.com/in/alexis-cresson/" target="_blank" rel="noopener noreferrer" className="text-indigo-300 underline hover:text-indigo-400">Linkedin</a></li>
        </ul>
      </section>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          style={{ animation: "fadeInBg 0.3s" }}
        >
          <div
            className="bg-zinc-900 rounded-xl shadow-2xl px-8 py-8 flex flex-col items-center animate-modalpop"
            style={{
              minWidth: 300,
              maxWidth: "90vw",
              border: "1.5px solid #6366f1",
              boxShadow: "0 8px 32px 0 rgba(0,0,0,0.35)",
            }}
          >
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-2 text-green-400" style={{display:'block'}}>
              <circle cx="12" cy="12" r="10" fill="#22c55e" fillOpacity="0.15"/>
              <path d="M8 12.5l2.5 2.5 5-5" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="text-lg font-semibold text-green-400 mb-1 text-center">Message envoyé !</div>
            <div className="text-gray-300 text-center text-sm">Merci pour votre message, nous vous répondrons rapidement.</div>
          </div>
          <style jsx global>{`
            @keyframes modalpop {
              0% { transform: scale(0.85) translateY(40px); opacity: 0;}
              100% { transform: scale(1) translateY(0); opacity: 1;}
            }
            .animate-modalpop {
              animation: modalpop 0.35s cubic-bezier(.33,1.5,.68,1) both;
            }
            @keyframes fadeInBg {
              from { opacity: 0;}
              to { opacity: 1;}
            }
          `}</style>
        </div>
      )}
    </main>
  );
}