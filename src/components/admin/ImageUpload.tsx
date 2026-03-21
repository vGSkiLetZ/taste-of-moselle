"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

interface ImageUploadProps {
  name: string;
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export default function ImageUpload({ name, value, onChange, label, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">(value && !value.startsWith("blob:") ? "url" : "upload");
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur d'upload");
        return;
      }

      onChange(data.url);
    } catch {
      setError("Erreur de connexion");
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  return (
    <div className={className}>
      {label && <label className="block text-sm font-semibold text-moselle-text mb-1">{label}</label>}

      {/* Mode toggle */}
      <div className="flex gap-1 mb-2">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1 px-3 py-1 text-xs rounded-lg transition-colors ${mode === "upload" ? "bg-moselle-green text-white" : "bg-moselle-cream text-moselle-text-light hover:bg-moselle-cream-dark"}`}
        >
          <Upload size={12} /> Upload
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1 px-3 py-1 text-xs rounded-lg transition-colors ${mode === "url" ? "bg-moselle-green text-white" : "bg-moselle-cream text-moselle-text-light hover:bg-moselle-cream-dark"}`}
        >
          <LinkIcon size={12} /> URL
        </button>
      </div>

      {mode === "upload" ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            dragActive
              ? "border-moselle-green bg-moselle-green/5"
              : "border-moselle-cream-dark hover:border-moselle-green/50"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileChange}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-moselle-green border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-moselle-text-light">Upload en cours...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon size={24} className="text-moselle-text-light" />
              <span className="text-sm text-moselle-text-light">
                Glissez une image ici ou <span className="text-moselle-green font-medium">parcourir</span>
              </span>
              <span className="text-xs text-moselle-text-light/60">JPG, PNG, WebP — max 5 Mo</span>
            </div>
          )}
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full border-2 border-moselle-cream-dark bg-moselle-white rounded-xl px-4 py-2.5 focus:border-moselle-green focus:ring-2 focus:ring-moselle-green/20 outline-none transition-colors text-moselle-text"
        />
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {/* Preview */}
      {value && (
        <div className="relative mt-2 rounded-xl overflow-hidden border-2 border-moselle-cream-dark max-w-xs">
          <img
            src={value}
            alt="Preview"
            className="w-full h-32 object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
