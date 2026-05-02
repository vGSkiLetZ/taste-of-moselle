"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { adresses, adresseGallery } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "./auth";
import { ensureUniqueSlug } from "./slug";
import { logAction } from "./log";

export async function createAdresseAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  await requireAuth();

  const name = formData.get("name") as string;
  if (!name) return { error: "Le nom est requis" };

  const scoreAccueil = Number(formData.get("scoreAccueil")) || 0;
  const scoreAssiette = Number(formData.get("scoreAssiette")) || 0;
  const scoreCadre = Number(formData.get("scoreCadre")) || 0;
  const scoreRapportQP = Number(formData.get("scoreRapportQP")) || 0;
  const tastyScore = Math.round(((scoreAccueil + scoreAssiette + scoreCadre + scoreRapportQP) / 4) * 10) / 10;

  const id = crypto.randomUUID().slice(0, 8);
  const desiredSlug = (formData.get("slug") as string) || name;
  const slug = await ensureUniqueSlug("adresses", desiredSlug, { fallbackSource: name });

  try {
    await db.insert(adresses).values({
      id,
      slug,
      name,
      category: formData.get("category") as string,
      geoZone: formData.get("geoZone") as string,
      tastyScore,
      scoreAccueil,
      scoreAssiette,
      scoreCadre,
      scoreRapportQP,
      budget: Number(formData.get("budget")) || 2,
      petitPlus: (formData.get("petitPlus") as string) || "",
      description: (formData.get("description") as string) || "",
      coverUrl: (formData.get("coverUrl") as string) || "/images/hero/placeholder-restaurant.png",
      coverAlt: (formData.get("coverAlt") as string) || name,
      coverWidth: Number(formData.get("coverWidth")) || 800,
      coverHeight: Number(formData.get("coverHeight")) || 600,
      lat: Number(formData.get("lat")) || 49.12,
      lng: Number(formData.get("lng")) || 6.18,
      googleMapsId: (formData.get("googleMapsId") as string) || null,
      phone: (formData.get("phone") as string) || null,
      reservationUrl: (formData.get("reservationUrl") as string) || null,
      website: (formData.get("website") as string) || null,
      address: (formData.get("address") as string) || "",
      openingHours: (formData.get("openingHours") as string) || null,
      tags: (formData.get("tags") as string) || "",
      publishedAt: (formData.get("publishedAt") as string) || new Date().toISOString().split("T")[0],
    });

    // Handle gallery images
    const galleryUrls = formData.getAll("galleryUrl") as string[];
    const galleryAlts = formData.getAll("galleryAlt") as string[];
    for (let i = 0; i < galleryUrls.length; i++) {
      if (galleryUrls[i]) {
        await db.insert(adresseGallery).values({
          adresseId: id,
          url: galleryUrls[i],
          alt: galleryAlts[i] || "",
          sortOrder: i,
        });
      }
    }
    await logAction("create", "adresse", id, name);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erreur lors de la creation";
    return { error: message };
  }

  revalidatePath("/");
  revalidatePath("/adresses");
  revalidatePath(`/adresses/${slug}`);
  revalidatePath("/carte");
  redirect("/admin/adresses");
}

export async function updateAdresseAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  await requireAuth();

  const id = formData.get("id") as string;
  if (!id) return { error: "ID manquant" };

  const name = formData.get("name") as string;
  if (!name) return { error: "Le nom est requis" };

  const scoreAccueil = Number(formData.get("scoreAccueil")) || 0;
  const scoreAssiette = Number(formData.get("scoreAssiette")) || 0;
  const scoreCadre = Number(formData.get("scoreCadre")) || 0;
  const scoreRapportQP = Number(formData.get("scoreRapportQP")) || 0;
  const tastyScore = Math.round(((scoreAccueil + scoreAssiette + scoreCadre + scoreRapportQP) / 4) * 10) / 10;

  const desiredSlug = (formData.get("slug") as string) || name;
  const slug = await ensureUniqueSlug("adresses", desiredSlug, {
    fallbackSource: name,
    excludeId: id,
  });

  try {
    await db
      .update(adresses)
      .set({
        slug,
        name,
        category: formData.get("category") as string,
        geoZone: formData.get("geoZone") as string,
        tastyScore,
        scoreAccueil,
        scoreAssiette,
        scoreCadre,
        scoreRapportQP,
        budget: Number(formData.get("budget")) || 2,
        petitPlus: (formData.get("petitPlus") as string) || "",
        description: (formData.get("description") as string) || "",
        coverUrl: (formData.get("coverUrl") as string) || "/images/hero/placeholder-restaurant.png",
        coverAlt: (formData.get("coverAlt") as string) || name,
        coverWidth: Number(formData.get("coverWidth")) || 800,
        coverHeight: Number(formData.get("coverHeight")) || 600,
        lat: Number(formData.get("lat")) || 49.12,
        lng: Number(formData.get("lng")) || 6.18,
        googleMapsId: (formData.get("googleMapsId") as string) || null,
        phone: (formData.get("phone") as string) || null,
        reservationUrl: (formData.get("reservationUrl") as string) || null,
        website: (formData.get("website") as string) || null,
        address: (formData.get("address") as string) || "",
        openingHours: (formData.get("openingHours") as string) || null,
        tags: (formData.get("tags") as string) || "",
        publishedAt: (formData.get("publishedAt") as string) || new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString(),
      })
      .where(eq(adresses.id, id));

    // Update gallery: delete all then re-insert
    await db.delete(adresseGallery).where(eq(adresseGallery.adresseId, id));
    const galleryUrls = formData.getAll("galleryUrl") as string[];
    const galleryAlts = formData.getAll("galleryAlt") as string[];
    for (let i = 0; i < galleryUrls.length; i++) {
      if (galleryUrls[i]) {
        await db.insert(adresseGallery).values({
          adresseId: id,
          url: galleryUrls[i],
          alt: galleryAlts[i] || "",
          sortOrder: i,
        });
      }
    }
    await logAction("update", "adresse", id, name);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erreur lors de la mise a jour";
    return { error: message };
  }

  revalidatePath("/");
  revalidatePath("/adresses");
  revalidatePath(`/adresses/${slug}`);
  revalidatePath("/carte");
  redirect("/admin/adresses");
}

export async function deleteAdresseAction(formData: FormData): Promise<void> {
  await requireAuth();
  const id = formData.get("id") as string;
  if (id) {
    const existing = await db
      .select({ slug: adresses.slug, name: adresses.name })
      .from(adresses)
      .where(eq(adresses.id, id))
      .limit(1);
    await db.delete(adresses).where(eq(adresses.id, id));
    if (existing[0]) {
      await logAction("delete", "adresse", id, existing[0].name);
      revalidatePath(`/adresses/${existing[0].slug}`);
    }
    revalidatePath("/");
    revalidatePath("/adresses");
    revalidatePath("/carte");
  }
  redirect("/admin/adresses");
}
