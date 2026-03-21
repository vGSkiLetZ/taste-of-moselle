"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "./auth";
import crypto from "crypto";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function createAdminUserAction(formData: FormData): Promise<void> {
  await requireAuth();

  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;
  const role = (formData.get("role") as string) || "editor";

  if (!username || !password || password.length < 8) {
    redirect("/admin/utilisateurs");
  }

  try {
    await db.insert(adminUsers).values({
      username,
      passwordHash: hashPassword(password),
      role,
    });
  } catch {
    // Username likely already exists
  }

  revalidatePath("/admin/utilisateurs");
  redirect("/admin/utilisateurs");
}

export async function deleteAdminUserAction(formData: FormData): Promise<void> {
  await requireAuth();

  const id = Number(formData.get("id"));
  if (id) {
    await db.delete(adminUsers).where(eq(adminUsers.id, id));
  }

  revalidatePath("/admin/utilisateurs");
  redirect("/admin/utilisateurs");
}
