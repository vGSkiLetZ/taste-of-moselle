"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "./auth";

export async function toggleMaintenanceAction(): Promise<void> {
  await requireAuth();

  const rows = await db.select().from(siteSettings).where(eq(siteSettings.key, "maintenance")).limit(1);
  const current = rows[0]?.value === "true";

  if (rows.length === 0) {
    await db.insert(siteSettings).values({ key: "maintenance", value: "true" });
  } else {
    await db.update(siteSettings).set({ value: current ? "false" : "true" }).where(eq(siteSettings.key, "maintenance"));
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function isMaintenanceMode(): Promise<boolean> {
  try {
    const rows = await db.select().from(siteSettings).where(eq(siteSettings.key, "maintenance")).limit(1);
    return rows[0]?.value === "true";
  } catch {
    return false;
  }
}
