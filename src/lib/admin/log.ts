"use server";

import { db } from "@/lib/db";
import { adminLogs } from "@/lib/db/schema";

export async function logAction(
  action: "create" | "update" | "delete",
  entity: "adresse" | "blog" | "review" | "comment",
  entityId: string,
  entityName: string
) {
  try {
    await db.insert(adminLogs).values({
      action,
      entity,
      entityId,
      entityName,
    });
  } catch {
    // Non-blocking — don't fail the main operation
  }
}
