"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FormCard from "@/components/services/FormCard";
import ResultCard from "@/components/services/ResultCard";
import TitleWithIcon from "@/components/services/TitleWithIcon";
import { FaImage } from "react-icons/fa";
import { FaFileImage, FaFileAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const FORMATS = [
  { label: "PNG", icon: <FaFileImage className="text-blue-400" /> },
  { label: "JPEG", icon: <FaFileImage className="text-yellow-400" /> },
  { label: "WEBP", icon: <FaFileImage className="text-green-400" /> },
  { label: "TIFF", icon: <FaFileImage className="text-purple-400" /> },
  { label: "AVIF", icon: <FaFileImage className="text-pink-400" /> },
  { label: "GIF", icon: <FaFileImage className="text-orange-400" /> },
  { label: "HEIF", icon: <FaFileImage className="text-teal-400" /> },
  { label: "JP2", icon: <FaFileImage className="text-red-400" /> },
  { label: "JXL", icon: <FaFileImage className="text-indigo-400" /> },
  { label: "ICO", icon: <FaFileImage className="text-gray-400" /> },
];

function getFormatFromExtension(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (!ext) return undefined;
  // Map common extensions to format labels
  switch (ext) {
    case "jpg": case "jpeg": return "JPEG";
    case "png": return "PNG";
    case "webp": return "WEBP";
    case "tif": case "tiff": return "TIFF";
    case "avif": return "AVIF";
    case "gif": return "GIF";
    case "heif": return "HEIF";
    case "jp2": return "JP2";
    case "jxl": return "JXL";
    case "ico": return "ICO";
    default: return undefined;
  }
}

export default function ConvertisseurImagesPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useState("");
  const [conversionResult, setConversionResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState<{ type: "success" | "error", message: string } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // For accessibility: describe file input
  const fileDescId = "file-input-desc";
  const formatDescId = "format-select-desc";

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiles.length || !outputFormat) return;
    setIsLoading(true);
    let hasError = false;
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("format", outputFormat.toLowerCase());

      try {
        const response = await fetch("/api/convertisseur-images", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Échec conversion");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${file.name.split(".")[0]}_converted.${outputFormat.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (err) {
        hasError = true;
        setModal({
          type: "error",
          message: `Erreur de conversion pour ${file.name}`,
        });
        break;
      }
    }
    setIsLoading(false);
    if (!hasError) {
      setConversionResult("Conversions terminées.");
      setModal({
        type: "success",
        message: "Toutes les images ont été converties avec succès !",
      });
    }
    // Focus result for accessibility
    setTimeout(() => {
      resultRef.current?.focus();
    }, 200);
  };

  // Auto-select outputFormat if one file and extension matches
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 10);
    setSelectedFiles(files);
    if (files.length === 1) {
      const autoFormat = getFormatFromExtension(files[0].name);
      if (autoFormat && FORMATS.some(f => f.label === autoFormat)) {
        setOutputFormat(autoFormat);
      }
    }
  };

  // Find icon for current outputFormat
  const currentFormatObj = FORMATS.find(f => f.label === outputFormat);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-800 via-black to-black px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="w-full flex justify-center"
      >
        <TitleWithIcon icon={<FaImage />} title="Convertisseur d'images" />
      </motion.div>

      <section aria-labelledby="converter-title" className="w-full flex flex-col items-center">
        <AnimatePresence>
          {modal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
              role="dialog"
              aria-modal="true"
              aria-live="assertive"
            >
              <div className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl px-8 py-7 flex flex-col items-center max-w-xs">
                {modal.type === "success" ? (
                  <FaCheckCircle className="text-green-500 text-4xl mb-2" aria-hidden="true" />
                ) : (
                  <FaTimesCircle className="text-red-500 text-4xl mb-2" aria-hidden="true" />
                )}
                <p className="text-white text-center mb-4">{modal.message}</p>
                <button
                  className="btn bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded shadow"
                  autoFocus
                  onClick={() => setModal(null)}
                  aria-label="Fermer la modale"
                >
                  OK
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <h2 id="converter-title" className="sr-only">
          Convertissez vos images dans le format souhaité
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-full flex flex-col items-center"
        >
          <FormCard
            title="Convertissez vos images dans le format souhaité"
            description="Importez vos fichiers (jusqu'à 10) et sélectionnez un format de sortie."
            onSubmit={handleConvert}
          >
            <div className="space-y-4">
              <div>
                <label
                  className="text-sm text-gray-300 mb-1 block"
                  htmlFor="file"
                >
                  🖼️ Importer des images
                </label>
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/*"
                  multiple
                  aria-label="Importer des images"
                  title="Importer des images"
                  aria-describedby={fileDescId}
                  onChange={handleFileChange}
                  className="file-input file-input-bordered file-input-md w-full bg-zinc-900 border-zinc-700 text-white"
                />
                <span id={fileDescId} className="sr-only">
                  Sélectionnez jusqu'à 10 images à convertir.
                </span>
              </div>

              <div className="relative">
                <label
                  className="text-sm text-gray-300 mb-1 block"
                  htmlFor="output-format"
                >
                  🎯 Format de sortie
                </label>
                <div className="relative">
                  <select
                    id="output-format"
                    aria-label="Format de sortie"
                    title="Sélectionner le format de sortie"
                    aria-describedby={formatDescId}
                    className="select select-bordered w-full bg-zinc-900 border-zinc-700 text-white pr-12"
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                  >
                    <option disabled value="">
                      Choisir le format
                    </option>
                    {FORMATS.map((format) => (
                      <option key={format.label}>{format.label}</option>
                    ))}
                  </select>
                  {/* Icon/extension displayed to the right */}
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {currentFormatObj?.icon}
                  </span>
                </div>
                <span id={formatDescId} className="sr-only">
                  Choisissez le format dans lequel convertir vos images.
                </span>
              </div>

              {/* Progress bar spinner */}
              {isLoading && (
                <div className="flex items-center justify-center">
                  <div className="w-full h-1 bg-zinc-700 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-indigo-500 animate-pulse w-full" />
                  </div>
                </div>
              )}

              <button
                className="btn w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-md shadow-md transition transform hover:scale-105"
                type="submit"
                disabled={!selectedFiles.length || !outputFormat || isLoading}
              >
                🔄 Convertir l&apos;image
              </button>
            </div>
          </FormCard>
        </motion.div>

        <div
          className="mt-6 w-full max-w-3xl"
          aria-live="polite"
          tabIndex={-1}
          ref={resultRef}
        >
          <AnimatePresence>
            {conversionResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
              >
                <ResultCard content={conversionResult} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <p className="text-xs text-gray-400 mt-8 text-center max-w-xl px-4">
        Formats pris en charge : PNG, JPEG, WEBP, TIFF, AVIF, GIF, HEIF, JP2, JXL et ICO.
      </p>
    </main>
  );
}