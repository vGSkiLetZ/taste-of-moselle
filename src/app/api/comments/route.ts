import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogComments } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

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
    const { postId, pseudo, comment } = await request.json();

    if (!postId || !pseudo || !comment) {
      return NextResponse.json({ error: "Champs requis" }, { status: 400 });
    }

    if (pseudo.length > 50 || comment.length > 500) {
      return NextResponse.json({ error: "Texte trop long" }, { status: 400 });
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
