import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getAllBlogPosts, getBlogPostBySlug, getAdresseBySlug } from "@/lib/api";
import { BLOG_PILLARS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { generateArticleSchema } from "@/lib/seo";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import ShareButton from "@/components/ui/ShareButton";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

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
        <div className="absolute inset-0 bg-gradient-to-t from-moselle-text/70 via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-white/90 hover:text-white transition-colors bg-black/20 backdrop-blur-sm rounded-full px-3 py-1.5"
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
            <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight [text-shadow:_0_2px_12px_rgba(0,0,0,0.4)]">
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
        <div className="prose prose-lg max-w-none mb-10">
          {post.content.split("\n\n").map((para, i) => {
            if (para.startsWith("## ")) {
              return (
                <h2
                  key={i}
                  className="font-[family-name:var(--font-heading)] text-2xl font-bold text-moselle-text mt-10 mb-4 section-heading"
                >
                  {para.replace("## ", "")}
                </h2>
              );
            }
            if (para.startsWith("### ")) {
              return (
                <h3
                  key={i}
                  className="font-[family-name:var(--font-heading)] text-xl font-semibold text-moselle-text mt-6 mb-3"
                >
                  {para.replace("### ", "")}
                </h3>
              );
            }
            return (
              <p
                key={i}
                className={`font-[family-name:var(--font-body)] text-moselle-text leading-relaxed mb-4 ${i === 0 ? "drop-cap" : ""}`}
              >
                {para}
              </p>
            );
          })}
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
      </article>
    </>
  );
}
