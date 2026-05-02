import { requireAuth } from "@/lib/admin/auth";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { BLOG_PILLARS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

export default async function PreviewBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAuth();
  const { slug } = await params;

  const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  if (rows.length === 0) notFound();

  const post = rows[0];
  const pillar = BLOG_PILLARS.find((p) => p.value === post.pillar);

  return (
    <>
      {/* Preview banner */}
      <div className="sticky top-0 z-50 bg-yellow-400 text-yellow-900 px-4 py-2 flex items-center justify-between text-sm font-semibold">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} />
          PRÉVISUALISATION — {post.status === "draft" ? "Brouillon" : post.status === "scheduled" ? "Planifié" : "Publié"}
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/admin/blog/${post.id}/edit`} className="underline">
            Modifier
          </Link>
          <Link href="/admin/blog" className="underline">
            Retour
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
        <Image
          src={post.coverUrl}
          alt={post.coverAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-moselle-text/70 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-3 py-1 mb-3 rounded-full bg-moselle-green text-white text-xs font-semibold uppercase tracking-wider">
              {pillar?.label}
            </span>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight [text-shadow:_0_2px_12px_rgba(0,0,0,0.4)]">
              {post.title}
            </h1>
            <p className="text-white/80 text-sm mt-3">
              {post.author} · {formatDate(post.publishedAt)} · {post.readingTime} min de lecture
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        <div
          className="prose prose-lg max-w-none text-moselle-text"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
        />
      </article>
    </>
  );
}
