"use client";

import { useState, useRef } from "react";
import { CheckCircle, AlertCircle, FileSpreadsheet } from "lucide-react";

interface ImportResult {
  success: number;
  errors: string[];
}

export default function CsvImporter() {
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);
    setImporting(true);

    try {
      const text = await file.text();
      const res = await fetch("/api/import-csv", {
        method: "POST",
        headers: { "Content-Type": "text/csv" },
        body: text,
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ success: 0, errors: ["Erreur réseau"] });
    }
    setImporting(false);
  };

  return (
    <div>
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-moselle-cream-dark rounded-2xl p-10 text-center cursor-pointer hover:border-moselle-green transition-colors"
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          onChange={handleFile}
          className="hidden"
        />
        {importing ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-moselle-green border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-moselle-text-light">Import en cours...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <FileSpreadsheet size={40} className="text-moselle-text-light" />
            <p className="text-sm text-moselle-text">
              {fileName || "Cliquez pour sélectionner un fichier CSV"}
            </p>
            <p className="text-xs text-moselle-text-light">
              Format : .csv avec séparateur virgule
            </p>
          </div>
        )}
      </div>

      {result && (
        <div className="mt-6 space-y-3">
          {result.success > 0 && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800">
              <CheckCircle size={18} />
              {result.success} adresse{result.success > 1 ? "s" : ""} importée{result.success > 1 ? "s" : ""} avec succès
            </div>
          )}
          {result.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-red-800 font-semibold mb-2">
                <AlertCircle size={18} />
                {result.errors.length} erreur{result.errors.length > 1 ? "s" : ""}
              </div>
              <ul className="text-xs text-red-700 space-y-1">
                {result.errors.map((err, i) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
