import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminLogs } from "@/lib/db/schema";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimit("suggestions", { windowMs: 60_000, max: 3 });
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Trop de requêtes, réessayez plus tard." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const data = await request.json();
    const honeypot = typeof data?.website_url === "string" ? data.website_url : "";
    if (honeypot) return NextResponse.json({ success: true });

    const name = typeof data?.name === "string" ? data.name.trim() : "";
    const reason = typeof data?.reason === "string" ? data.reason.trim() : "";
    const submittedBy =
      typeof data?.submittedBy === "string" ? data.submittedBy.trim() : "";

    if (!name || !reason) {
      return NextResponse.json({ error: "Champs requis" }, { status: 400 });
    }

    if (name.length > 120 || reason.length > 1000 || submittedBy.length > 80) {
      return NextResponse.json({ error: "Champs trop longs" }, { status: 400 });
    }

    await db.insert(adminLogs).values({
      action: "create",
      entity: "suggestion",
      entityId: crypto.randomUUID().slice(0, 8),
      entityName: `${name} — ${reason.slice(0, 60)}${reason.length > 60 ? "..." : ""} (par ${submittedBy || "anonyme"})`,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
