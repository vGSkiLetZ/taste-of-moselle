import { requireAuth } from "@/lib/admin/auth";
import AdminNav from "@/components/admin/AdminNav";
import AdresseForm from "@/components/admin/AdresseForm";
import { updateAdresseAction } from "@/lib/admin/adresse-actions";
import { db } from "@/lib/db";
import { adresses, adresseGallery } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Adresse, Category, GeoZone, BudgetLevel } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditAdressePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;

  const rows = await db.select().from(adresses).where(eq(adresses.id, id)).limit(1);
  if (rows.length === 0) notFound();

  const row = rows[0];
  const galleryRows = await db.select().from(adresseGallery).where(eq(adresseGallery.adresseId, id)).orderBy(asc(adresseGallery.sortOrder));

  const adresse: Adresse = {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as Category,
    geoZone: row.geoZone as GeoZone,
    tastyScore: row.tastyScore,
    scoreCriteria: {
      accueil: row.scoreAccueil,
      assiette: row.scoreAssiette,
      cadre: row.scoreCadre,
      rapportQualitePrix: row.scoreRapportQP,
    },
    budget: row.budget as BudgetLevel,
    petitPlus: row.petitPlus,
    description: row.description,
    coverImage: { url: row.coverUrl, alt: row.coverAlt, width: row.coverWidth, height: row.coverHeight },
    gallery: galleryRows.map((g) => ({ url: g.url, alt: g.alt, width: g.width, height: g.height })),
    coordinates: { lat: row.lat, lng: row.lng },
    googleMapsId: row.googleMapsId ?? undefined,
    phone: row.phone ?? undefined,
    reservationUrl: row.reservationUrl ?? undefined,
    website: row.website ?? undefined,
    address: row.address,
    openingHours: row.openingHours ?? undefined,
    tags: row.tags ? row.tags.split(",") : [],
    publishedAt: row.publishedAt,
  };

  return (
    <>
      <AdminNav />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/admin/adresses" className="inline-flex items-center gap-1 text-sm text-moselle-text-light hover:text-moselle-green mb-4">
          <ArrowLeft size={14} /> Retour aux adresses
        </Link>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-moselle-text mb-6">
          Modifier : {adresse.name}
        </h1>
        <AdresseForm action={updateAdresseAction} adresse={adresse} />
      </div>
    </>
  );
}
