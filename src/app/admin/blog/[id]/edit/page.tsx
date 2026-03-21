import { requireAuth } from "@/lib/admin/auth";
import AdminNav from "@/components/admin/AdminNav";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { updateBlogPostAction } from "@/lib/admin/blog-actions";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { BlogPost, BlogPillar } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;

  const rows = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  if (rows.length === 0) notFound();

  const row = rows[0];
  const post: BlogPost & { status: string } = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    pillar: row.pillar as BlogPillar,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: { url: row.coverUrl, alt: row.coverAlt, width: row.coverWidth, height: row.coverHeight },
    author: row.author,
    publishedAt: row.publishedAt,
    readingTime: row.readingTime,
    relatedAdresses: row.relatedAdresses ? row.relatedAdresses.split(",") : [],
    tags: row.tags ? row.tags.split(",") : [],
    status: row.status,
  };

  return (
    <>
      <AdminNav />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/admin/blog" className="inline-flex items-center gap-1 text-sm text-moselle-text-light hover:text-moselle-green mb-4">
          <ArrowLeft size={14} /> Retour aux articles
        </Link>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-moselle-text mb-6">
          Modifier : {post.title}
        </h1>
        <BlogPostForm action={updateBlogPostAction} post={post} />
      </div>
    </>
  );
}
