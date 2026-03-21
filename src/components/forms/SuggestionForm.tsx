"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { CATEGORIES, GEO_ZONES } from "@/lib/constants";
import { useToast } from "@/components/ui/Toast";

const inputClass =
  "w-full border-2 border-moselle-cream-dark bg-moselle-white rounded-xl px-4 py-2.5 focus:border-moselle-green focus:ring-2 focus:ring-moselle-green/20 outline-none transition-colors text-moselle-text";

export default function SuggestionForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    try {
      await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          category: formData.get("category"),
          zone: formData.get("zone"),
          address: formData.get("address"),
          website: formData.get("website"),
          reason: formData.get("reason"),
          submittedBy: formData.get("submittedBy"),
        }),
      });
      setSubmitted(true);
      toast("success", "Suggestion envoyée !");
    } catch {
      toast("error", "Erreur lors de l'envoi");
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="paper-texture bg-moselle-cream rounded-[var(--radius-card)] p-8 text-center">
        <div className="relative z-2">
          <CheckCircle size={48} className="text-moselle-green mx-auto mb-4" />
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-moselle-text mb-2">
            Merci pour votre suggestion !
          </h2>
          <p className="text-moselle-text-light">
            Nous allons étudier cette adresse et peut-être aller la tester. Restez connecté !
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="paper-texture bg-moselle-cream rounded-[var(--radius-card)] p-6 sm:p-8">
      <div className="relative z-2 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-moselle-text mb-1">Nom du restaurant / adresse *</label>
          <input type="text" name="name" required maxLength={100} className={inputClass} placeholder="Ex: Chez Marie" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-moselle-text mb-1">Catégorie</label>
            <select name="category" className={inputClass}>
              <option value="">Non précisé</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-moselle-text mb-1">Zone</label>
            <select name="zone" className={inputClass}>
              <option value="">Non précisé</option>
              {GEO_ZONES.map((z) => (
                <option key={z.value} value={z.value}>{z.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-moselle-text mb-1">Adresse</label>
          <input type="text" name="address" maxLength={200} className={inputClass} placeholder="Rue, ville..." />
        </div>

        <div>
          <label className="block text-sm font-semibold text-moselle-text mb-1">Site web / Instagram</label>
          <input type="text" name="website" maxLength={200} className={inputClass} placeholder="https://..." />
        </div>

        <div>
          <label className="block text-sm font-semibold text-moselle-text mb-1">Pourquoi cette adresse ? *</label>
          <textarea name="reason" required rows={3} maxLength={500} className={inputClass + " resize-none"} placeholder="Qu'est-ce qui rend cet endroit spécial ?" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-moselle-text mb-1">Votre pseudo</label>
          <input type="text" name="submittedBy" maxLength={50} className={inputClass} placeholder="Optionnel" />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-moselle-green text-white py-3 rounded-xl font-semibold hover:bg-moselle-green/90 transition-colors disabled:opacity-50 btn-press"
        >
          <Send size={16} />
          {submitting ? "Envoi en cours..." : "Envoyer ma suggestion"}
        </button>
      </div>
    </form>
  );
}
