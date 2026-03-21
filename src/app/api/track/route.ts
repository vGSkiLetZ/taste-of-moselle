import { db } from "@/lib/db";
import { pageViews } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageType, pageSlug } = body;

    if (!pageType || !pageSlug) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!["adresse", "blog"].includes(pageType)) {
      return NextResponse.json({ error: "Invalid pageType" }, { status: 400 });
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
