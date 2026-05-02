"use server";

import { db } from "@/lib/db";
import { adresses, reviews } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAuth } from "./auth";
import { rateLimit } from "@/lib/rate-limit";

async function revalidateAdresseBySlug(adresseId: string) {
  const row = await db
    .select({ slug: adresses.slug })
    .from(adresses)
    .where(eq(adresses.id, adresseId))
    .limit(1);
  if (row[0]) {
    revalidatePath(`/adresses/${row[0].slug}`);
  }
}

export async function submitReviewAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const adresseId = formData.get("adresseId") as string;
  const pseudo = (formData.get("pseudo") as string)?.trim();
  const rating = parseInt(formData.get("rating") as string);
  const comment = (formData.get("comment") as string)?.trim();
  const honeypot = (formData.get("website") as string) || "";

  if (honeypot) return { success: true };

  if (!adresseId || !pseudo || !rating) {
    return { error: "Veuillez remplir tous les champs obligatoires." };
  }

  if (rating < 1 || rating > 5) {
    return { error: "La note doit être entre 1 et 5." };
  }

  if (pseudo.length < 2 || pseudo.length > 50) {
    return { error: "Le pseudo doit faire entre 2 et 50 caractères." };
  }

  if (comment && comment.length > 1000) {
    return { error: "Le commentaire est trop long (1000 caractères max)." };
  }

  const limit = await rateLimit("submit-review", { windowMs: 60_000, max: 3 });
  if (!limit.ok) {
    return { error: "Trop de soumissions, réessayez plus tard." };
  }

  // Verify the adresse exists.
  const adresse = await db
    .select({ id: adresses.id })
    .from(adresses)
    .where(eq(adresses.id, adresseId))
    .limit(1);
  if (adresse.length === 0) {
    return { error: "Adresse introuvable." };
  }

  await db.insert(reviews).values({
    adresseId,
    pseudo,
    rating,
    comment: comment || "",
  });

  // Pending reviews aren't shown publicly, no public revalidation yet.
  revalidatePath("/admin/avis");
  return { success: true };
}

export async function approveReviewAction(id: number) {
  await requireAuth();
  const row = await db
    .select({ adresseId: reviews.adresseId })
    .from(reviews)
    .where(eq(reviews.id, id))
    .limit(1);
  await db.update(reviews).set({ approved: true }).where(eq(reviews.id, id));
  revalidatePath("/admin/avis");
  revalidatePath("/adresses");
  if (row[0]) await revalidateAdresseBySlug(row[0].adresseId);
}

export async function deleteReviewAction(id: number) {
  await requireAuth();
  const row = await db
    .select({ adresseId: reviews.adresseId })
    .from(reviews)
    .where(eq(reviews.id, id))
    .limit(1);
  await db.delete(reviews).where(eq(reviews.id, id));
  revalidatePath("/admin/avis");
  revalidatePath("/adresses");
  if (row[0]) await revalidateAdresseBySlug(row[0].adresseId);
}
