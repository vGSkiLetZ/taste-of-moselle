"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { submitReviewAction } from "@/lib/admin/review-actions";

interface ReviewFormProps {
  adresseId: string;
}

export default function ReviewForm({ adresseId }: ReviewFormProps) {
  const [state, formAction, isPending] = useActionState(submitReviewAction, null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  if (state?.success) {
    return (
      <div className="paper-texture bg-moselle-cream rounded-[var(--radius-card)] p-5 text-center">
        <div className="relative z-2">
          <p className="text-moselle-green font-semibold mb-1">Merci pour votre avis !</p>
          <p className="text-sm text-moselle-text-light">Il sera visible apres moderation.</p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="paper-texture bg-moselle-cream rounded-[var(--radius-card)] p-5">
      <div className="relative z-2 space-y-4">
        <h3 className="font-[family-name:var(--font-heading)] font-semibold text-lg text-moselle-text section-heading">
          Laisser un avis
        </h3>

        {state?.error && (
          <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{state.error}</p>
        )}

        <input type="hidden" name="adresseId" value={adresseId} />
        <input type="hidden" name="rating" value={rating} />

        <div>
          <label className="block text-sm font-medium text-moselle-text mb-1">Votre pseudo *</label>
          <input
            type="text"
            name="pseudo"
            required
            maxLength={50}
            className="w-full border-2 border-moselle-cream-dark bg-moselle-white rounded-xl px-4 py-2 focus:border-moselle-green focus:ring-2 focus:ring-moselle-green/20 outline-none transition-colors text-moselle-text text-sm"
            placeholder="Votre nom ou pseudo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-moselle-text mb-1">Votre note *</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <Star
                  size={24}
                  className={`transition-colors ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-moselle-cream-dark"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-moselle-text mb-1">Votre commentaire</label>
          <textarea
            name="comment"
            rows={3}
            maxLength={500}
            className="w-full border-2 border-moselle-cream-dark bg-moselle-white rounded-xl px-4 py-2 focus:border-moselle-green focus:ring-2 focus:ring-moselle-green/20 outline-none transition-colors text-moselle-text text-sm resize-none"
            placeholder="Partagez votre experience..."
          />
        </div>

        <button
          type="submit"
          disabled={isPending || rating === 0}
          className="bg-moselle-green text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-moselle-green/90 transition-colors disabled:opacity-50 btn-press"
        >
          {isPending ? "Envoi..." : "Envoyer mon avis"}
        </button>
      </div>
    </form>
  );
}
