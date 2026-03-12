"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

export default function ContactForm() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSending(false);
    toast("form-sent", "Message envoyé !");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-[family-name:var(--font-heading)] font-semibold text-sm text-moselle-text mb-1.5">
            Prénom
          </label>
          <input
            type="text"
            placeholder="Marie"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-moselle-cream-dark bg-moselle-white text-moselle-text placeholder:text-moselle-text-light/50 focus:outline-none focus:ring-2 focus:ring-moselle-green/30 focus:border-moselle-green transition-colors"
          />
        </div>
        <div>
          <label className="block font-[family-name:var(--font-heading)] font-semibold text-sm text-moselle-text mb-1.5">
            Nom
          </label>
          <input
            type="text"
            placeholder="Dupont"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-moselle-cream-dark bg-moselle-white text-moselle-text placeholder:text-moselle-text-light/50 focus:outline-none focus:ring-2 focus:ring-moselle-green/30 focus:border-moselle-green transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block font-[family-name:var(--font-heading)] font-semibold text-sm text-moselle-text mb-1.5">
          Email
        </label>
        <input
          type="email"
          placeholder="marie@email.fr"
          required
          className="w-full px-4 py-2.5 rounded-xl border border-moselle-cream-dark bg-moselle-white text-moselle-text placeholder:text-moselle-text-light/50 focus:outline-none focus:ring-2 focus:ring-moselle-green/30 focus:border-moselle-green transition-colors"
        />
      </div>
      <div>
        <label className="block font-[family-name:var(--font-heading)] font-semibold text-sm text-moselle-text mb-1.5">
          Sujet
        </label>
        <select className="w-full px-4 py-2.5 rounded-xl border border-moselle-cream-dark bg-moselle-white text-moselle-text focus:outline-none focus:ring-2 focus:ring-moselle-green/30 focus:border-moselle-green transition-colors">
          <option>Suggérer une adresse</option>
          <option>Question générale</option>
          <option>Collaboration / Partenariat</option>
          <option>Signaler une erreur</option>
          <option>Autre</option>
        </select>
      </div>
      <div>
        <label className="block font-[family-name:var(--font-heading)] font-semibold text-sm text-moselle-text mb-1.5">
          Message
        </label>
        <textarea
          rows={5}
          placeholder="Votre message..."
          required
          className="w-full px-4 py-2.5 rounded-xl border border-moselle-cream-dark bg-moselle-white text-moselle-text placeholder:text-moselle-text-light/50 focus:outline-none focus:ring-2 focus:ring-moselle-green/30 focus:border-moselle-green transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="w-full sm:w-auto px-8 py-3 bg-moselle-green text-white rounded-full font-[family-name:var(--font-heading)] font-semibold text-sm uppercase tracking-wider hover:bg-moselle-green-light transition-colors btn-press disabled:opacity-60"
      >
        {sending ? "Envoi..." : "Envoyer"}
      </button>
    </form>
  );
}
