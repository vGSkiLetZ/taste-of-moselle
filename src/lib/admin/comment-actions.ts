"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { blogComments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "./auth";

export async function approveCommentAction(formData: FormData): Promise<void> {
  await requireAuth();
  const id = Number(formData.get("id"));
  if (id) {
    await db.update(blogComments).set({ approved: true }).where(eq(blogComments.id, id));
    revalidatePath("/admin/commentaires");
  }
  redirect("/admin/commentaires");
}

export async function deleteCommentAction(formData: FormData): Promise<void> {
  await requireAuth();
  const id = Number(formData.get("id"));
  if (id) {
    await db.delete(blogComments).where(eq(blogComments.id, id));
    revalidatePath("/admin/commentaires");
  }
  redirect("/admin/commentaires");
}
