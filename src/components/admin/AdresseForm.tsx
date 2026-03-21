"use client";

import { useActionState, useState, useEffect } from "react";
import { CATEGORIES, GEO_ZONES, BUDGET_LABELS } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import type { Adresse } from "@/lib/types";
import ImageUpload from "./ImageUpload";

const inputClass =
  "w-full border-2 border-moselle-cream-dark bg-moselle-white rounded-xl px-4 py-2.5 focus:border-moselle-green focus:ring-2 focus:ring-moselle-green/20 outline-none transition-colors text-moselle-text";
const labelClass = "block text-sm font-semibold text-moselle-text mb-1";

interface AdresseFormProps {
  action: (prevState: { error?: string } | null, formData: FormData) => Promise<{ error?: string }>;
  adresse?: Adresse;
}

export default function AdresseForm({ action, adresse }: AdresseFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [name, setName] = useState(adresse?.name || "");
  const [slug, setSlug] = useState(adresse?.slug || "");
  const [coverUrl, setCoverUrl] = useState(adresse?.coverImage?.url || "");
  const [galleryItems, setGalleryItems] = useState<{ url: string; alt: string }[]>(
    adresse?.gallery?.map((g) => ({ url: g.url, alt: g.alt })) || []
  );

  useEffect(() => {
    if (!adresse) setSlug(slugify(name));
  }, [name, adresse]);

  return (
    <form action={formAction} className="space-y-6 max-w-3xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {state.error}
        </div>
      )}

      {adresse && <input type="hidden" name="id" value={adresse.id} />}

      {/* Nom + Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nom *</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
            placeholder="Le Magasin aux Vivres"
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
            placeholder="le-magasin-aux-vivres"
          />
        </div>
      </div>

      {/* Categorie + Zone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Categorie *</label>
          <select name="category" defaultValue={adresse?.category || ""} required className={inputClass}>
            <option value="" disabled>Choisir...</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Zone geographique *</label>
          <select name="geoZone" defaultValue={adresse?.geoZone || ""} required className={inputClass}>
            <option value="" disabled>Choisir...</option>
            {GEO_ZONES.map((z) => (
              <option key={z.value} value={z.value}>{z.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className={labelClass}>Budget *</label>
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((level) => (
            <label key={level} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="budget"
                value={level}
                defaultChecked={adresse?.budget === level || (!adresse && level === 2)}
                className="accent-moselle-green"
              />
              <span className="text-sm">{BUDGET_LABELS[level]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Scores */}
      <div>
        <label className={labelClass}>Scores (0-10)</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: "scoreAccueil", label: "Accueil", val: adresse?.scoreCriteria?.accueil },
            { name: "scoreAssiette", label: "Assiette", val: adresse?.scoreCriteria?.assiette },
            { name: "scoreCadre", label: "Cadre", val: adresse?.scoreCriteria?.cadre },
            { name: "scoreRapportQP", label: "Rapport Q/P", val: adresse?.scoreCriteria?.rapportQualitePrix },
          ].map((s) => (
            <div key={s.name}>
              <span className="text-xs text-moselle-text-light">{s.label}</span>
              <input
                type="number"
                name={s.name}
                min={0}
                max={10}
                step={0.5}
                defaultValue={s.val ?? 7}
                className={inputClass}
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-moselle-text-light mt-1">Le TastyScore est calcule automatiquement (moyenne)</p>
      </div>

      {/* Petit Plus + Description */}
      <div>
        <label className={labelClass}>Le petit plus *</label>
        <input
          type="text"
          name="petitPlus"
          defaultValue={adresse?.petitPlus || ""}
          className={inputClass}
          placeholder="Ce qui rend ce lieu unique..."
        />
      </div>
      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={adresse?.description || ""}
          className={inputClass}
          placeholder="Decrivez le restaurant..."
        />
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
          <input type="text" name="coverAlt" defaultValue={adresse?.coverImage?.alt || ""} className={inputClass} />
        </div>
        <div>
          <span className="text-xs text-moselle-text-light">Largeur</span>
          <input type="number" name="coverWidth" defaultValue={adresse?.coverImage?.width || 800} className={inputClass} />
        </div>
        <div>
          <span className="text-xs text-moselle-text-light">Hauteur</span>
          <input type="number" name="coverHeight" defaultValue={adresse?.coverImage?.height || 600} className={inputClass} />
        </div>
      </div>

      {/* Galerie */}
      <div>
        <label className={labelClass}>Galerie photos</label>
        {galleryItems.map((item, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              name="galleryUrl"
              value={item.url}
              onChange={(e) => {
                const copy = [...galleryItems];
                copy[i].url = e.target.value;
                setGalleryItems(copy);
              }}
              placeholder="URL image"
              className={inputClass + " flex-1"}
            />
            <input
              type="text"
              name="galleryAlt"
              value={item.alt}
              onChange={(e) => {
                const copy = [...galleryItems];
                copy[i].alt = e.target.value;
                setGalleryItems(copy);
              }}
              placeholder="Alt"
              className={inputClass + " w-32"}
            />
            <button
              type="button"
              onClick={() => setGalleryItems(galleryItems.filter((_, j) => j !== i))}
              className="text-red-500 hover:text-red-700 px-2"
            >
              &times;
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setGalleryItems([...galleryItems, { url: "", alt: "" }])}
          className="text-sm text-moselle-green hover:underline"
        >
          + Ajouter une image
        </button>
      </div>

      {/* Adresse + Coordonnees */}
      <div>
        <label className={labelClass}>Adresse postale *</label>
        <input type="text" name="address" defaultValue={adresse?.address || ""} className={inputClass} placeholder="1 Place de Chambre, 57000 Metz" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Latitude</label>
          <input type="number" name="lat" step="any" defaultValue={adresse?.coordinates?.lat || 49.12} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Longitude</label>
          <input type="number" name="lng" step="any" defaultValue={adresse?.coordinates?.lng || 6.18} className={inputClass} />
        </div>
      </div>

      {/* Infos pratiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Telephone</label>
          <input type="tel" name="phone" defaultValue={adresse?.phone || ""} className={inputClass} placeholder="+33 3 87 ..." />
        </div>
        <div>
          <label className={labelClass}>Site web</label>
          <input type="url" name="website" defaultValue={adresse?.website || ""} className={inputClass} placeholder="https://..." />
        </div>
        <div>
          <label className={labelClass}>URL reservation</label>
          <input type="url" name="reservationUrl" defaultValue={adresse?.reservationUrl || ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Google Maps ID</label>
          <input type="text" name="googleMapsId" defaultValue={adresse?.googleMapsId || ""} className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Horaires d&apos;ouverture</label>
        <input type="text" name="openingHours" defaultValue={adresse?.openingHours || ""} className={inputClass} placeholder="Mar-Sam: 12h-14h, 19h-22h" />
      </div>

      {/* Tags + Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Tags (separes par des virgules)</label>
          <input type="text" name="tags" defaultValue={adresse?.tags?.join(",") || ""} className={inputClass} placeholder="quiche,terrasse,romantique" />
        </div>
        <div>
          <label className={labelClass}>Date de publication</label>
          <input type="date" name="publishedAt" defaultValue={adresse?.publishedAt?.split("T")[0] || new Date().toISOString().split("T")[0]} className={inputClass} />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-moselle-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-moselle-green/90 transition-colors disabled:opacity-50"
      >
        {isPending ? "Enregistrement..." : adresse ? "Mettre a jour" : "Creer l'adresse"}
      </button>
    </form>
  );
}
