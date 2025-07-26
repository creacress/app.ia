"use client";
import React, { useState } from "react";
import FormCard from "@/components/services/FormCard";
import ResultCard from "@/components/services/ResultCard";
import TitleWithIcon from "@/components/services/TitleWithIcon";
import { FaImage } from "react-icons/fa";

export default function ConvertisseurImagesPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useState("");
  const [conversionResult, setConversionResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiles.length || !outputFormat) return;
    setIsLoading(true);
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
        console.error(`Erreur de conversion pour ${file.name}`, err);
      }
    }
    setIsLoading(false);
    setConversionResult("Conversions terminées.");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-800 via-black to-black px-4 py-10">
      <TitleWithIcon icon={<FaImage />} title="Convertisseur d'images" />

      <FormCard
        title="Convertissez vos images dans le format souhaité"
        description="Importez vos fichiers (jusqu'à 10) et sélectionnez un format de sortie."
        onSubmit={handleConvert}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-1 block">🖼️ Importer des images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []).slice(0, 10);
                setSelectedFiles(files);
              }}
              className="file-input file-input-bordered file-input-md w-full bg-zinc-900 border-zinc-700 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">🎯 Format de sortie</label>
            <select
              className="select select-bordered w-full bg-zinc-900 border-zinc-700 text-white"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
            >
              <option disabled value="">
                Choisir le format
              </option>
              {[
                "PNG", "JPEG", "WEBP", "TIFF", "AVIF", "GIF", "HEIF", "JP2", "JXL", "ICO"
              ].map((format) => (
                <option key={format}>{format}</option>
              ))}
            </select>
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

      {conversionResult && (
        <div className="mt-6 w-full max-w-3xl">
          <ResultCard content={conversionResult} />
        </div>
      )}

      <p className="text-xs text-gray-400 mt-8 text-center max-w-xl px-4">
        Formats pris en charge : PNG, JPEG, WEBP, TIFF, AVIF, GIF, HEIF, JP2, JXL et ICO.
      </p>
    </main>
  );
}