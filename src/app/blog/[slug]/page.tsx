import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getAllBlogPosts, getBlogPostBySlug, getAdresseBySlug } from "@/lib/api";
import { BLOG_PILLARS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { generateArticleSchema } from "@/lib/seo";
import { sanitizeHtml } from "@/lib/sanitize";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import ShareButton from "@/components/ui/ShareButton";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ViewTracker from "@/components/analytics/ViewTracker";
import CommentSection from "@/components/blog/CommentSection";
import ReadingProgress from "@/components/ui/ReadingProgress";

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Article introuvable" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage.url],
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const pillar = BLOG_PILLARS.find((p) => p.value === post.pillar);
  const articleSchema = generateArticleSchema(post);

  const relatedAdresses = await Promise.all(
    post.relatedAdresses.map((s) => getAdresseBySlug(s))
  );

  return (
    <>
      <ViewTracker pageType="blog" pageSlug={post.slug} />
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero image full-width */}
      <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
        <Image
          src={post.coverImage.url}
          alt={post.coverImage.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover vintage-img"
        />
        {/* Stronger overlay so the title stays readable on bright photos */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        <div className="absolute top-4 left-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-white/90 hover:text-white transition-colors bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5"
          >
            <ArrowLeft size={16} />
            Blog
          </Link>
        </div>
        <div className="absolute top-4 right-4">
          <ShareButton title={post.title} text={post.excerpt} />
        </div>
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <div className="max-w-3xl mx-auto">
            <Badge variant="cream" className="mb-3">
              {pillar?.label}
            </Badge>
            <h1
              className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight"
              style={{
                color: "#ffffff",
                textShadow:
                  "0 3px 16px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)",
              }}
            >
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="max-w-3xl mx-auto px-4 pt-3 pb-1">
        <Breadcrumbs
          items={[
            { label: "Le Blog", href: "/blog" },
            { label: post.title },
          ]}
        />
      </div>

      <article className="max-w-3xl mx-auto px-4 relative z-10 pb-12">
        {/* Meta bar */}
        <div className="paper-texture bg-moselle-cream rounded-[var(--radius-card)] p-4 sm:p-5 mb-8 shadow-lg">
          <div className="relative z-2 flex flex-wrap items-center justify-between gap-3">
            <span className="font-[family-name:var(--font-accent)] text-lg text-moselle-green">
              {post.author}
            </span>
            <div className="flex items-center gap-4 text-sm text-moselle-text-light">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {post.readingTime} min
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none mb-10 blog-content font-[family-name:var(--font-body)] text-moselle-text"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
        />

        {/* Author bio */}
        <div className="mt-10 pt-8 border-t border-moselle-cream-dark">
          <div className="flex items-start gap-4 bg-moselle-cream/40 rounded-2xl p-5">
            <div className="shrink-0 w-14 h-14 rounded-full bg-moselle-green text-white flex items-center justify-center font-[family-name:var(--font-heading)] font-bold text-xl">
              {post.author
                .split(/\s+/)
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <p className="font-[family-name:var(--font-accent)] text-2xl text-moselle-green leading-tight">
                {post.author}
              </p>
              <p className="font-[family-name:var(--font-body)] italic text-sm text-moselle-text-light mt-1">
                Deux amoureux du terroir mosellan, en quête des meilleures tables, producteurs et petites pépites de la région.
              </p>
              <Link
                href="/a-propos"
                className="inline-flex items-center gap-1 mt-2 text-sm text-moselle-green hover:text-moselle-green-light transition-colors font-semibold"
              >
                À propos →
              </Link>
            </div>
          </div>
        </div>

        {/* Related addresses */}
        {relatedAdresses.filter(Boolean).length > 0 && (
          <div className="mt-10 pt-8 border-t-2 border-moselle-cream-dark">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-moselle-text mb-4 section-heading">
              Adresses mentionnées
            </h2>
            <div className="grid gap-3">
              {relatedAdresses.filter(Boolean).map((adresse) => (
                <Link key={adresse!.slug} href={`/adresses/${adresse!.slug}`}>
                  <Card borderColor="green" className="p-4 group card-hover-lift">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-[family-name:var(--font-heading)] font-semibold text-moselle-text group-hover:text-moselle-green transition-colors">
                          {adresse!.name}
                        </h3>
                        <p className="font-[family-name:var(--font-body)] italic text-sm text-moselle-text-light">
                          {adresse!.petitPlus}
                        </p>
                      </div>
                      <div className="shrink-0 ml-4">
                        <div className="w-10 h-10 bg-moselle-green text-white rounded-full flex items-center justify-center font-[family-name:var(--font-heading)] font-bold text-sm">
                          {adresse!.tastyScore.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="mt-12 pt-8 border-t border-moselle-cream-dark">
          <h2 className="font-[family-name:var(--font-heading)] font-semibold text-xl text-moselle-text mb-6 section-heading">
            Commentaires
          </h2>
          <CommentSection postId={post.id} />
        </div>
      </article>
    </>
  );
}
