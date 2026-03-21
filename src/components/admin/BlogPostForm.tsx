"use client";

import { useActionState, useState, useEffect } from "react";
import { BLOG_PILLARS } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";
import ImageUpload from "./ImageUpload";

const inputClass =
  "w-full border-2 border-moselle-cream-dark bg-moselle-white rounded-xl px-4 py-2.5 focus:border-moselle-green focus:ring-2 focus:ring-moselle-green/20 outline-none transition-colors text-moselle-text";
const labelClass = "block text-sm font-semibold text-moselle-text mb-1";

interface BlogPostFormProps {
  action: (prevState: { error?: string } | null, formData: FormData) => Promise<{ error?: string }>;
  post?: BlogPost;
}

export default function BlogPostForm({ action, post }: BlogPostFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [coverUrl, setCoverUrl] = useState(post?.coverImage?.url || "");

  useEffect(() => {
    if (!post) setSlug(slugify(title));
  }, [title, post]);

  return (
    <form action={formAction} className="space-y-6 max-w-3xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {state.error}
        </div>
      )}

      {post && <input type="hidden" name="id" value={post.id} />}

      {/* Titre + Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Titre *</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClass}
            placeholder="Ou manger la meilleure quiche lorraine ?"
          />
        </div>
        <div>
          <label className={labelClass}>Slug (URL)</label>
          <input
            type="text"
            name="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Pilier + Auteur */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Pilier *</label>
          <select name="pillar" defaultValue={post?.pillar || ""} required className={inputClass}>
            <option value="" disabled>Choisir...</option>
            {BLOG_PILLARS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label} — {p.description}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Auteur</label>
          <input
            type="text"
            name="author"
            defaultValue={post?.author || "Les Tasty"}
            className={inputClass}
          />
        </div>
      </div>

      {/* Extrait */}
      <div>
        <label className={labelClass}>Extrait *</label>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt || ""}
          className={inputClass}
          placeholder="Un court resume qui apparait dans les listings..."
        />
      </div>

      {/* Contenu */}
      <div>
        <label className={labelClass}>Contenu (Markdown) *</label>
        <textarea
          name="content"
          rows={15}
          defaultValue={post?.content || ""}
          className={inputClass + " font-mono text-sm"}
          placeholder={"## Sous-titre\n\nVotre texte ici...\n\n### Un autre sous-titre\n\nEcrivez en **gras** ou en *italique*."}
        />
        <p className="text-xs text-moselle-text-light mt-1">
          Utilisez la syntaxe Markdown : ## pour les titres, **gras**, *italique*, [lien](url)
        </p>
      </div>

      {/* Image de couverture */}
      <ImageUpload
        name="coverUrl"
        value={coverUrl}
        onChange={setCoverUrl}
        label="Image de couverture"
      />
      <div className="grid grid-cols-3 gap-2">
        <div>
          <span className="text-xs text-moselle-text-light">Alt</span>
          <input type="text" name="coverAlt" defaultValue={post?.coverImage?.alt || ""} className={inputClass} />
        </div>
        <div>
          <span className="text-xs text-moselle-text-light">Largeur</span>
          <input type="number" name="coverWidth" defaultValue={post?.coverImage?.width || 800} className={inputClass} />
        </div>
        <div>
          <span className="text-xs text-moselle-text-light">Hauteur</span>
          <input type="number" name="coverHeight" defaultValue={post?.coverImage?.height || 600} className={inputClass} />
        </div>
      </div>

      {/* Adresses liees + Tags */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Adresses liees (slugs separes par des virgules)</label>
          <input
            type="text"
            name="relatedAdresses"
            defaultValue={post?.relatedAdresses?.join(",") || ""}
            className={inputClass}
            placeholder="chez-mauricette,le-magasin-aux-vivres"
          />
        </div>
        <div>
          <label className={labelClass}>Tags (separes par des virgules)</label>
          <input
            type="text"
            name="tags"
            defaultValue={post?.tags?.join(",") || ""}
            className={inputClass}
            placeholder="quiche,moselle,gastronomie"
          />
        </div>
      </div>

      {/* Date */}
      <div className="max-w-xs">
        <label className={labelClass}>Date de publication</label>
        <input
          type="date"
          name="publishedAt"
          defaultValue={post?.publishedAt?.split("T")[0] || new Date().toISOString().split("T")[0]}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-moselle-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-moselle-green/90 transition-colors disabled:opacity-50"
      >
        {isPending ? "Enregistrement..." : post ? "Mettre a jour" : "Creer l'article"}
      </button>
    </form>
  );
}
