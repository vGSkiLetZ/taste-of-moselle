import { db } from "@/lib/db";
import { pageViews } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimit("track", { windowMs: 60_000, max: 60 });
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const body = await request.json();
    const pageType = typeof body?.pageType === "string" ? body.pageType : "";
    const pageSlug = typeof body?.pageSlug === "string" ? body.pageSlug : "";

    if (!pageType || !pageSlug) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!["adresse", "blog"].includes(pageType)) {
      return NextResponse.json({ error: "Invalid pageType" }, { status: 400 });
    }

    if (pageSlug.length > 200 || !/^[a-z0-9-]+$/i.test(pageSlug)) {
      return NextResponse.json({ error: "Invalid pageSlug" }, { status: 400 });
    }

    await db.insert(pageViews).values({
      pageType,
      pageSlug,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
