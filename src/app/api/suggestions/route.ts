import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminLogs } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, category, zone, address, website, reason, submittedBy } = data;

    if (!name || !reason) {
      return NextResponse.json({ error: "Champs requis" }, { status: 400 });
    }

    // Log the suggestion as an admin log entry for review
    await db.insert(adminLogs).values({
      action: "create",
      entity: "suggestion" as any,
      entityId: crypto.randomUUID().slice(0, 8),
      entityName: `${name} — ${reason.slice(0, 60)}${reason.length > 60 ? "..." : ""} (par ${submittedBy || "anonyme"})`,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
