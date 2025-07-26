'use client';
import React, { useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import SuiviPage from '@/components/SuiviPage';

export default function PDFCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'recommended' | 'extreme'>('recommended');
  const [compressionInfo, setCompressionInfo] = useState<{ gain: number, show: boolean }>({ gain: 0, show: false });
  const [backendAlert, setBackendAlert] = useState<string | null>(null);
  const hasFile = !!file;

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    setOutput(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', compressionLevel);

    try {
      const res = await fetch('/api/pdf-compressor', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Compression échouée avec le statut ${res.status}`);
      }

      const data = await res.json();
      console.log("Réponse backend compression PDF :", JSON.stringify(data, null, 2));

      if (!data?.url) {
        throw new Error("Pas de lien renvoyé par le backend");
      }

      // Afficher un popup si la taille compressée est supérieure ou presque égale à l’originale
      const gain = ((data.originalSize - data.compressedSize) / data.originalSize) * 100;
      if (gain < 5) {
        setCompressionInfo({ gain, show: true });
      } else {
        setCompressionInfo({ gain, show: false });
      }

      setOutput(data.url);
      setBackendAlert(data.alert || null);
    } catch (err: any) {
      console.error("Erreur compression PDF :", err);
      alert("Erreur : impossible de compresser ce fichier PDF.\n" + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Extraction de texte du PDF
  const handleExtractText = async () => {
    if (!file) return;
    setLoading(true);
    setOutput(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('https://support.microgenie.app/extract', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Échec de l'extraction : ${res.status}`);
      }

      const data = await res.json();
      console.log("Texte extrait :", data);
      setOutput(data.text);
    } catch (err: any) {
      console.error("Erreur d'extraction :", err);
      alert("Impossible d'extraire le texte du PDF.\n" + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center mb-6 animate-fade-in">
              <SuiviPage />
        
        <svg className="w-16 h-16 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M4 8V7a2 2 0 012-2h12a2 2 0 012 2v1M4 12h16" />
        </svg>
      </div>
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-black to-black text-white px-6 py-16">
        {compressionInfo.show && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-zinc-900 border border-yellow-600 text-white px-6 py-4 rounded-xl shadow-xl z-50 animate-fade-in max-w-md text-center">
            <h3 className="font-bold text-lg text-yellow-400 mb-1">📉 Compression peu efficace</h3>
            <p className="text-sm text-zinc-300">
              Le fichier n’a été réduit que de {compressionInfo.gain.toFixed(1)}%.<br />
              Il est possible qu’il soit déjà optimisé ou très difficile à compresser davantage.
            </p>
          </div>
        )}
        {compressionInfo.gain > 5 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-900 border border-green-600 text-white px-6 py-4 rounded-xl shadow-xl z-50 animate-fade-in max-w-md text-center">
            <h3 className="font-bold text-lg text-green-400 mb-1">✅ Compression réussie</h3>
            <p className="text-sm text-zinc-300">
              Le fichier a été réduit de <strong>{compressionInfo.gain.toFixed(1)}%</strong>. <br />
              Une version plus légère a été générée avec le niveau de compression <strong>{compressionLevel}</strong>.
            </p>
          </div>
        )}
        <div className="max-w-2xl mx-auto">
          {!hasFile ? (
            <div className="text-center space-y-6 animate-fade-in">
              <h1 className="text-4xl font-bold mb-4">📄 Compresser le fichier PDF</h1>
              <p className="text-zinc-400">Diminuez la taille de votre PDF tout en conservant une bonne qualité !</p>
              <label
                htmlFor="pdfUpload"
                className="cursor-pointer bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-3 rounded-full inline-flex items-center gap-2 font-semibold text-lg transition"
              >
                📂 Sélectionner le fichier PDF
              </label>
              <input
                id="pdfUpload"
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-bold mb-4 text-center animate-fade-in flex items-center justify-center gap-3">
                📉 Compresseur de PDF
              </h1>
              <h2 className="text-center text-zinc-400 mb-6 animate-fade-in delay-150">
                Compressez vos fichiers PDF en un clic. Réduction de taille sans perte visible de qualité !
              </h2>

              <div className="bg-zinc-800/80 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-zinc-700 space-y-4 animate-fade-in">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Fichier sélectionné : {file?.name}
                </label>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Niveau de compression :
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { level: 'extreme', label: 'Compression extrême', desc: 'Moins de qualité, haute compression' },
                      { level: 'recommended', label: 'Compression recommandée', desc: 'Bonne qualité, bonne compression' },
                      { level: 'low', label: 'Basse compression', desc: 'Haute qualité, moins de compression' }
                    ].map(opt => (
                      <label key={opt.level} className={`p-4 rounded-xl border cursor-pointer transition-all
                        ${compressionLevel === opt.level ? 'border-yellow-500 bg-zinc-700/50' : 'border-zinc-600 bg-zinc-800/40'}
                      `}>
                        <input
                          type="radio"
                          name="compression"
                          value={opt.level}
                          checked={compressionLevel === opt.level}
                          onChange={() => setCompressionLevel(opt.level as 'low' | 'recommended' | 'extreme')}
                          className="hidden"
                        />
                        <span className="block font-semibold mb-1 text-white">{opt.label}</span>
                        <span className="text-sm text-zinc-400">{opt.desc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCompress}
                  disabled={loading}
                  className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all duration-200 px-4 py-2 rounded text-white font-semibold transform hover:scale-[1.02]"
                >
                  🗜️ Compresser le PDF
                </button>

                <button
                  onClick={handleExtractText}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 transition-all duration-200 px-4 py-2 rounded text-white font-semibold transform hover:scale-[1.02]"
                >
                  🧠 Extraire le résumé PDF
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

              {output && !backendAlert && (
                <div className="mt-10 p-6 rounded-xl bg-zinc-900/80 backdrop-blur-md border border-zinc-700 shadow-2xl animate-fade-in text-center space-y-4">
                  <h2 className="text-xl font-semibold text-yellow-400">
                    📜 Résumé / texte extrait :
                  </h2>
                  <pre className="whitespace-pre-wrap text-sm text-zinc-300">{output}</pre>
                </div>
              )}
              <div className="flex justify-center mt-6 animate-fade-in">
                <button
                  onClick={() => {
                    setFile(null);
                    setOutput(null);
                    setCompressionInfo({ gain: 0, show: false });
                    setBackendAlert(null);
                  }}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded transition"
                >
                  🔄 Recommencer une compression
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      {backendAlert && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-900 border border-red-600 text-white px-6 py-4 rounded shadow-2xl z-50 animate-fade-in max-w-md text-center">
          <h3 className="font-bold text-lg mb-1">⚠️ Compression impossible ou inefficace</h3>
          <p className="text-sm text-zinc-300">{backendAlert}</p>
        </div>
      )}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </>
  );
}