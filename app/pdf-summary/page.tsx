"use client";

import { useState, useEffect, useRef } from "react";
import { useHistoryStore } from "../../lib/useHistoryStore";

const mockDetectLangAndTone = (text: string) => {
  // Mock detection logic
  return { lang: "Français", type: "Formel" };
};

export default function PDFSummaryPage() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [showQuotaPopup, setShowQuotaPopup] = useState(false);
  const [langTone, setLangTone] = useState<{ lang: string; type: string } | null>(null);
  const [charCount, setCharCount] = useState(0);
  const { history, addToHistory } = useHistoryStore();
  const [dragActive, setDragActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [readingMode, setReadingMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [displayedSummary, setDisplayedSummary] = useState("");
  const typewriterInterval = useRef<NodeJS.Timeout | null>(null);
  const toast = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (summary) {
      addToHistory({
        fileName: file?.name || "Inconnu",
        summary,
        date: new Date().toLocaleString(),
      });
    }
  }, [summary]);

  // Update char count when summary changes
  useEffect(() => {
    setCharCount(summary?.length || 0);
  }, [summary]);

  // Typewriter effect for summary display (affiche tout le texte, y compris la première lettre, dès le début)
  useEffect(() => {
    if (!summary) {
      setDisplayedSummary("");
      return;
    }

    if (typewriterInterval.current) clearInterval(typewriterInterval.current);

    let index = 0;
    const initialDelay = 5;
    setDisplayedSummary(summary.charAt(0));
    index = 1;

    typewriterInterval.current = setInterval(() => {
      setDisplayedSummary((prev) => prev + summary.charAt(index));
      index++;
      if (index >= summary.length && typewriterInterval.current) {
        clearInterval(typewriterInterval.current);
      }
    }, 15);

    return () => {
      if (typewriterInterval.current) clearInterval(typewriterInterval.current);
    };
  }, [summary]);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setSummary("");
    setLangTone(null);
    setShowLimitPopup(false);
    if (history.length >= 10) {
      setShowQuotaPopup(true);
      setLoading(false);
      return;
    }
    setProgress(0);

    // Simulate progress bar
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 90) {
          clearInterval(interval);
          return oldProgress;
        }
        return oldProgress + 10;
      });
    }, 300);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/pdf-summary", {
      method: "POST",
      body: formData,
    });

    clearInterval(interval);
    setProgress(100);

    const data = await res.json();
    if (res.status === 413 || data?.partial || data?.truncated) {
      setShowLimitPopup(true);
      toast.current?.classList.remove("hidden");
      setTimeout(() => {
        toast.current?.classList.add("hidden");
      }, 5000);
    }
    if (data?.summary) {
      setSummary(data.summary);
      setLangTone(mockDetectLangAndTone(data.summary));
    }
    setLoading(false);
    setTimeout(() => setProgress(0), 500);
  };

  const downloadMarkdown = () => {
    const watermark = "\n\n---\nRésumé généré par IA - microgenie.app";
    const blob = new Blob([`# Résumé\n\n${summary}${watermark}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume.md";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Résumé", 10, 10);
    const lines = doc.splitTextToSize(summary, 180);
    doc.text(lines, 10, 20);
    doc.save("resume.pdf");
  };

  const downloadText = () => {
    const watermark = "\n\n---\nRésumé généré par IA - microgenie.app";
    const blob = new Blob([summary + watermark], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <main
      className={`min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-black to-black text-white px-6 py-16 ${readingMode ? "reading-mode" : ""
        } ${showQuotaPopup ? "blurred" : ""}`}
    >
      <div className="w-full max-w-2xl px-4 sm:px-6 lg:px-8 mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center animate-fade-in flex items-center justify-center gap-3">
          <svg
            className={`w-10 h-10 text-indigo-400 animate-pulse-slow`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M12 4h9" />
            <path d="M4 9h16" />
            <path d="M4 15h16" />
            <circle cx="2" cy="12" r="1" />
          </svg>
          Résumé de PDF
        </h1>
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`bg-zinc-800/80 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-zinc-700 space-y-4 animate-fade-in ${dragActive ? "drag-active" : ""
            }`}
        >
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Sélectionne ton fichier :
          </label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".pdf,.ppt,.pptx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-white"
            />
            {file && (
              <span className="inline-flex items-center space-x-2 bg-indigo-700 text-indigo-100 px-3 py-1 rounded text-xs font-semibold select-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>{file.name.split(".").pop()?.toUpperCase() || "FILE"}</span>
              </span>
            )}
          </div>

          {/* Badge dynamique pour la limite de caractères */}
          {file && (
            <div className="text-sm text-indigo-300 font-mono select-none">
              ⚠️ Seuls les 10 000 premiers caractères seront traités en version gratuite.
            </div>
          )}

          <button
            onClick={handleUpload}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-300 transition-all duration-200 px-4 py-2 rounded text-white font-semibold transform hover:scale-[1.02] flex justify-center items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>Résumé en cours...</span>
              </>
            ) : (
              "Lancer le résumé"
            )}
          </button>

          {loading && (
            <div className="relative w-full h-1 bg-indigo-900 rounded overflow-hidden mt-2">
              <div
                className="absolute top-0 left-0 h-1 bg-indigo-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {showLimitPopup && (
            <div className="mt-4 p-4 rounded bg-yellow-900 text-yellow-200 border border-yellow-700 text-sm animate-fade-in">
              Ce document dépasse la limite gratuite de 10 000 caractères. Seuls les 10 000 premiers caractères ont été traités.
              <br />
              Pour garantir un service stable, seuls les fichiers courts sont traités.
              <br />
              <br />
              <strong>Comparatif Gratuit / Premium :</strong>
              <ul className="list-disc list-inside mt-1 text-yellow-100 text-xs">
                <li>Gratuit : limite 10 000 caractères, support basique.</li>
                <li>Premium : documents plus longs, traitement prioritaire, export avancé.</li>
              </ul>
            </div>
          )}
        </div>

        {summary && (
          <div className="mt-10 p-6 rounded-xl bg-zinc-900/80 backdrop-blur-md border border-zinc-700 shadow-2xl animate-fade-in relative">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-indigo-400 flex items-center gap-2">
                Résumé :
                <svg
                  onClick={handleCopy}
                  className={`w-5 h-5 cursor-pointer text-indigo-300 hover:text-indigo-100 transition-colors ${copied ? "animate-copy" : ""
                    }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <title>{copied ? "Copié !" : "Copier le résumé"}</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16h8M8 12h8m-6 8h6a2 2 0 002-2v-6a2 2 0 00-2-2h-6a2 2 0 00-2 2v6a2 2 0 002 2zM8 8V6a2 2 0 012-2h4a2 2 0 012 2v2"
                  />
                </svg>
              </h2>
              <button
                onClick={() => setReadingMode(!readingMode)}
                className="text-xs px-3 py-1 border border-indigo-400 rounded hover:bg-indigo-400 hover:text-black transition-colors select-none"
                title="Toggle mode lecture (zoom et contraste)"
              >
                {readingMode ? "Mode normal" : "Mode lecture"}
              </button>
            </div>

            {langTone && (
              <div className="mb-3 text-indigo-300 text-sm font-mono select-none">
                Langue détectée : <strong>{langTone.lang}</strong> | Ton : <strong>{langTone.type}</strong>
              </div>
            )}

            <p className="text-gray-300 whitespace-pre-wrap min-h-[120px]">{displayedSummary}</p>

            <div className="mt-3 text-gray-400 text-xs font-mono select-none">
              {charCount} caractères
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={downloadText}
                className="bg-green-600 hover:bg-green-500 focus-visible:ring-2 focus-visible:ring-green-300 transition-all duration-200 px-4 py-2 rounded text-white font-semibold transform hover:scale-[1.02]"
              >
                Exporter le résumé
              </button>

              <button
                onClick={downloadMarkdown}
                className="bg-purple-600 hover:bg-purple-500 focus-visible:ring-2 focus-visible:ring-purple-300 transition-all duration-200 px-4 py-2 rounded text-white font-semibold transform hover:scale-[1.02]"
              >
                Exporter en Markdown
              </button>

              <button
                onClick={downloadPDF}
                className="bg-red-600 hover:bg-red-500 focus-visible:ring-2 focus-visible:ring-red-300 transition-all duration-200 px-4 py-2 rounded text-white font-semibold transform hover:scale-[1.02]"
              >
                Exporter en PDF
              </button>
            </div>

            <div className="watermark-text select-none pointer-events-none">
              Résumé généré par IA - microgenie.app
            </div>
          </div>
        )}

        {history.length > 0 && (
          <section className="mt-10 p-4 bg-zinc-900/70 border border-zinc-700 rounded text-gray-400 text-sm max-w-2xl mx-auto">
            <h3 className="mb-2 font-semibold text-indigo-400">Historique des résumés</h3>
            <ul className="list-disc list-inside max-h-48 overflow-y-auto">
              {history.map(({ fileName, summary: sum, date }, i) => (
                <li key={i} className="mb-1">
                  <strong>{fileName}</strong> - <em>{date}</em>
                  <div className="truncate max-w-full" title={sum}>
                    <button
                      onClick={() => {
                        setSummary(sum);
                        setLangTone(mockDetectLangAndTone(sum));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-indigo-300 underline hover:text-indigo-100 transition-colors text-left w-full truncate"
                    >
                      Voir le résumé
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div
        ref={toast}
        className="fixed top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 text-black text-sm font-semibold py-3 px-6 rounded-xl shadow-xl transition-all duration-300 hidden z-50 fade-in-out border border-yellow-600"
      >
        📌 Résumé partiel : seuls les 10 000 premiers caractères ont été traités.
      </div>

      {showQuotaPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-zinc-900 border border-indigo-700 rounded-xl p-6 w-full max-w-md shadow-xl text-white animate-fade-in">
            <h2 className="text-xl font-semibold mb-4 text-indigo-400">Limite atteinte</h2>
            <p className="text-sm mb-4">
              Vous avez atteint la limite de <strong>10 résumés PDF gratuits</strong>. Chaque traitement a un coût serveur, même en version gratuite.
              <br />
              Pour continuer, vous pouvez :
            </p>
            <ul className="text-sm list-disc list-inside mb-4 space-y-1">
              <li>Payer à l'usage pour chaque nouveau résumé</li>
              <li>Passer à l'offre <strong>Premium</strong> : documents plus longs, illimités, traitement prioritaire</li>
            </ul>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-sm rounded"
                onClick={() => setShowQuotaPopup(false)}
              >
                Fermer
              </button>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm rounded font-semibold">
                Voir les options
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .loader {
          border: 3px solid #a5b4fc;
          border-top: 3px solid #6366f1;
          border-radius: 50%;
          width: 1em;
          height: 1em;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        .drag-active {
          border-color: #8b5cf6 !important;
          background-color: rgba(139, 92, 246, 0.2);
          box-shadow: 0 0 8px 2px #8b5cf6;
        }
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-copy {
          animation: copyAnim 1.5s ease forwards;
        }
        @keyframes copyAnim {
          0% { transform: scale(1); color: #a78bfa; }
          50% { transform: scale(1.3); color: #a5b4fc; }
          100% { transform: scale(1); color: #a78bfa; }
        }
        .reading-mode {
          filter: contrast(1.2);
          font-size: 1.125rem;
        }
        .fade-in-out {
          animation: fadeInOut 5s ease-in-out;
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          10%, 90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        .watermark-text {
          position: absolute;
          bottom: 8px;
          right: 12px;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.1);
          user-select: none;
          pointer-events: none;
          font-weight: 700;
          letter-spacing: 0.1em;
        }
      `}</style>
    </main>
  );
}
<style jsx>{`
  .blurred {
    filter: blur(2px);
    pointer-events: none;
  }
`}</style>