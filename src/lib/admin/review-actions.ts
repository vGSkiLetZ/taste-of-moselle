"use server";

import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAuth } from "./auth";

export async function submitReviewAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const adresseId = formData.get("adresseId") as string;
  const pseudo = (formData.get("pseudo") as string)?.trim();
  const rating = parseInt(formData.get("rating") as string);
  const comment = (formData.get("comment") as string)?.trim();

  if (!adresseId || !pseudo || !rating) {
    return { error: "Veuillez remplir tous les champs obligatoires." };
  }

  if (rating < 1 || rating > 5) {
    return { error: "La note doit être entre 1 et 5." };
  }

  if (pseudo.length < 2 || pseudo.length > 50) {
    return { error: "Le pseudo doit faire entre 2 et 50 caractères." };
  }

  await db.insert(reviews).values({
    adresseId,
    pseudo,
    rating,
    comment: comment || "",
  });

  revalidatePath(`/adresses`);
  return { success: true };
}

export async function approveReviewAction(id: number) {
  await requireAuth();
  await db.update(reviews).set({ approved: true }).where(eq(reviews.id, id));
  revalidatePath("/admin/avis");
  revalidatePath("/adresses");
}

export async function deleteReviewAction(id: number) {
  await requireAuth();
  await db.delete(reviews).where(eq(reviews.id, id));
  revalidatePath("/admin/avis");
  revalidatePath("/adresses");
}
