'use client';
import React, { useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import SuiviPage from '@/components/SuiviPage';

export default function ExcelCleanerPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [cleanEmails, setCleanEmails] = useState(true);
  const [sanitizeCharacters, setSanitizeCharacters] = useState(true);

  const [file, setFile] = useState<File | null>(null);

  const handleClean = async () => {
    if (!input.trim() && !file) {
      setError('');
      return;
    }
    setLoading(true);
    setOutput('');
    setError('');

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('removeDuplicates', String(removeDuplicates));
      formData.append('cleanEmails', String(cleanEmails));
      formData.append('sanitizeCharacters', String(sanitizeCharacters));

      const res = await fetch('/api/excel-cleaner/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Une erreur est survenue.');
        setLoading(false);
        return;
      }
      if (data?.output) setOutput(data.output);
      setLoading(false);
      return;
    }

    const res = await fetch('/api/excel-cleaner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, removeDuplicates, cleanEmails, sanitizeCharacters }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data?.error || 'Une erreur est survenue.');
      setLoading(false);
      return;
    }
    if (data?.output) setOutput(data.output);
    setLoading(false);
  };

  return (
    <>
      <div className="flex justify-center mb-6 animate-fade-in">
        <SuiviPage />
        
        <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18M3 9h18M3 13.5h18M3 18h18" />
        </svg>
      </div>
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-black to-black text-white px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-zinc-400 mb-6 animate-fade-in delay-150">
            Nettoyez vos données Excel en un clic : emails, noms, doublons, caractères inutiles…
          </p>
          <h1 className="text-4xl font-bold mb-4 text-center animate-fade-in flex items-center justify-center gap-3">
            🧹 Nettoyeur de Fichier Excel
          </h1>

          <div className="bg-zinc-800/80 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-zinc-700 space-y-4 animate-fade-in">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Ou importez un fichier :
            </label>
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-500"
            />

            <label className="block text-sm font-medium text-gray-300 mb-1">
              Collez vos données Excel brutes ici :
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={10}
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ex : Jean Dupont, JEAN DUPONT, jean.dupont@gmail.com, JEAN.DUPONT@gmail.com…"
            />

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" checked={removeDuplicates} onChange={() => setRemoveDuplicates(!removeDuplicates)} />
                Supprimer les doublons
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" checked={cleanEmails} onChange={() => setCleanEmails(!cleanEmails)} />
                Nettoyer les emails invalides
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" checked={sanitizeCharacters} onChange={() => setSanitizeCharacters(!sanitizeCharacters)} />
                Supprimer les caractères spéciaux
              </label>
            </div>

            <button
              onClick={handleClean}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 transition-all duration-200 px-4 py-2 rounded text-white font-semibold transform hover:scale-[1.02]"
            >
              🧼 Nettoyer les données
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-900 border border-red-600 text-red-300 rounded">
                ⚠️ {error}
              </div>
            )}

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
              <h2 className="text-xl font-semibold text-green-400 mb-2">✅ Résultat Nettoyé :</h2>
              <pre className="text-gray-300 whitespace-pre-wrap">{output}</pre>
              <a
                href={`data:text/csv;charset=utf-8,${encodeURIComponent(output)}`}
                download="donnees_nettoyees.csv"
                className="inline-block mt-4 px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded transition"
              >
                ⬇️ Télécharger le fichier nettoyé
              </a>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
        `}</style>
      </main>
    </>
  );
}