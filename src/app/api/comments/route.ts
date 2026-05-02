import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogComments, blogPosts } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get("postId");
  if (!postId) return NextResponse.json([]);

  const comments = await db
    .select()
    .from(blogComments)
    .where(and(eq(blogComments.postId, postId), eq(blogComments.approved, true)))
    .orderBy(desc(blogComments.createdAt));

  return NextResponse.json(comments);
}

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimit("comments", { windowMs: 60_000, max: 5 });
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Trop de requêtes, réessayez plus tard." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const body = await request.json();
    const postId = typeof body?.postId === "string" ? body.postId.trim() : "";
    const pseudo = typeof body?.pseudo === "string" ? body.pseudo.trim() : "";
    const comment = typeof body?.comment === "string" ? body.comment.trim() : "";
    const honeypot = typeof body?.website === "string" ? body.website : "";

    if (honeypot) {
      // Bots that auto-fill all fields trip this. Pretend success.
      return NextResponse.json({ success: true });
    }

    if (!postId || !pseudo || !comment) {
      return NextResponse.json({ error: "Champs requis" }, { status: 400 });
    }

    if (pseudo.length < 2 || pseudo.length > 50) {
      return NextResponse.json({ error: "Pseudo invalide" }, { status: 400 });
    }

    if (comment.length < 2 || comment.length > 500) {
      return NextResponse.json({ error: "Commentaire invalide" }, { status: 400 });
    }

    // Verify the post exists to prevent FK pollution.
    const post = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.id, postId))
      .limit(1);
    if (post.length === 0) {
      return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
    }

    await db.insert(blogComments).values({
      postId,
      pseudo,
      comment,
      approved: false,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
