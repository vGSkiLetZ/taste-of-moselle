"use client";

import { useState, useEffect } from "react";
import { Send, User } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Comment {
  id: number;
  pseudo: string;
  comment: string;
  createdAt: string;
}

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [pseudo, setPseudo] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}`)
      .then((r) => r.json())
      .then((data) => setComments(data))
      .catch(() => {});
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudo.trim() || !comment.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, pseudo: pseudo.trim(), comment: comment.trim() }),
      });
      setSubmitted(true);
      setComment("");
    } catch {
      // ignore
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Comment list */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="bg-moselle-cream/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-moselle-green/20 flex items-center justify-center">
                  <User size={14} className="text-moselle-green" />
                </div>
                <span className="font-semibold text-sm text-moselle-text">{c.pseudo}</span>
                <span className="text-xs text-moselle-text-light">
                  {formatDate(c.createdAt)}
                </span>
              </div>
              <p className="text-sm text-moselle-text leading-relaxed">{c.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-moselle-text-light italic">
          Aucun commentaire pour le moment. Soyez le premier !
        </p>
      )}

      {/* Comment form */}
      {submitted ? (
        <div className="bg-moselle-green/10 text-moselle-green rounded-xl p-4 text-sm font-medium text-center">
          Merci ! Votre commentaire sera visible après modération.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder="Votre pseudo"
            required
            maxLength={50}
            className="w-full border-2 border-moselle-cream-dark bg-moselle-white rounded-xl px-4 py-2.5 focus:border-moselle-green outline-none transition-colors text-sm"
          />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Votre commentaire..."
            required
            rows={3}
            maxLength={500}
            className="w-full border-2 border-moselle-cream-dark bg-moselle-white rounded-xl px-4 py-2.5 focus:border-moselle-green outline-none transition-colors text-sm resize-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-moselle-green text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-moselle-green/90 transition-colors disabled:opacity-50 active:scale-95"
          >
            <Send size={14} />
            {submitting ? "Envoi..." : "Commenter"}
          </button>
        </form>
      )}
    </div>
  );
}
