"use client";

import { useState, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LinkedInPostPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("professionnel");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<{ input: string; output: string; date: string }[]>([]);

  useEffect(() => {
    const h = localStorage.getItem("linkedinHistory");
    if (h) setHistory(JSON.parse(h));
  }, []);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");

    const res = await fetch("/api/linkedin-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, tone }),
    });

    const data = await res.json();
    if (data?.output) setOutput(data.output);
    if (data?.output) {
      const newEntry = { input, output: data.output, date: new Date().toISOString() };
      const updated = [newEntry, ...history].slice(0, 10);
      setHistory(updated);
      localStorage.setItem("linkedinHistory", JSON.stringify(updated));
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex justify-center mb-6 animate-fade-in">
      </div>
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-black to-black text-white px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-zinc-400 mb-6 animate-fade-in delay-150">
            Rédigez automatiquement des posts engageants pour LinkedIn à l’aide de notre IA !
          </p>
          <h1 className="text-4xl font-bold mb-4 text-center animate-fade-in flex items-center justify-center gap-3">
            <svg className="w-8 h-8 text-indigo-400 animate-pulse-slow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M16 8a6 6 0 01-12 0"></path>
              <circle cx="12" cy="4" r="2" />
              <path d="M14 14s1 0 2 1 1 2 1 2" />
            </svg>
            Générateur de Post LinkedIn
          </h1>

          <div className="bg-zinc-800/80 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-zinc-700 space-y-4 animate-fade-in">
            <label className="block text-sm font-medium text-gray-300 mb-1">Ton du post :</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none relative mb-4"
            >
              <option value="professionnel">🧠 Professionnel</option>
              <option value="fun">🎉 Fun</option>
              <option value="provocateur">🔥 Provocateur</option>
              <option value="humain">❤️ Humain</option>
            </select>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Décrivez le contenu de votre post :
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={5}
              maxLength={1000}
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex : retour d'expérience pro, nouveauté produit, opinion..."
            />
            <div className="text-sm text-indigo-300 font-mono text-right">{input.length}/1000</div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 px-4 py-2 rounded text-white font-semibold transform hover:scale-[1.02]"
            >
              🚀 Générer le post
            </button>

            {loading && (
              <div className="flex justify-center py-4">
                <DotLottieReact
                  src="https://lottie.host/029a308e-47a9-44c9-a0ff-e9fc233c305f/R1xxNMDUUO.json"
                  loop
                  autoplay
                  style={{ width: 80, height: 80 }}
                />
              </div>
            )}
          </div>

          {output && (
            <div className="mt-10 p-6 rounded-xl bg-zinc-900/80 backdrop-blur-md border border-zinc-700 shadow-2xl animate-fade-in">
              <h2 className="text-xl font-semibold text-indigo-400 mb-2">✨ Votre post LinkedIn :</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{output}</p>
            </div>
          )}
          {output && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(output);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="mt-2 px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded transition"
            >
              📋 Copier le post
            </button>
          )}
          {copied && <p className="text-green-400 text-sm mt-1">✅ Copié !</p>}
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
          .animate-pulse-slow {
            animation: pulse 3s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </main>
      {history.length > 0 && (
        <div className="fixed top-24 left-6 w-72 bg-zinc-900 border border-zinc-700 p-4 rounded shadow max-h-[80vh] overflow-auto">
          <h3 className="text-lg text-indigo-400 font-bold mb-3">🕓 Historique</h3>
          {history.map((item, idx) => (
            <div
              key={idx}
              className="mb-4 p-2 border border-zinc-700 rounded cursor-pointer hover:bg-zinc-800 transition"
              onClick={() => {
                setInput(item.input);
                setOutput(item.output);
              }}
            >
              <div className="text-xs text-zinc-500 mb-1">{new Date(item.date).toLocaleString()}</div>
              <div className="text-sm text-gray-300 line-clamp-3">{item.output}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}