import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, BookOpen, Users, Compass } from "lucide-react";
import { getAllBlogPosts } from "@/lib/api";
import { BLOG_PILLARS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { AnimatedItem } from "@/components/blog/AnimatedBlogGrid";

export const metadata: Metadata = {
  title: "Le Blog",
  description:
    "Dossiers thématiques, rencontres avec les artisans, et nos escapades gourmandes. Le blog de Taste of Moselle.",
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();
  const sorted = posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <>
      {/* Hero */}
      <section className="section-cream py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-[family-name:var(--font-accent)] text-2xl text-moselle-green mb-2">
            Nos aventures
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-extrabold text-moselle-text tracking-tight mb-4">
            <span className="italic">Le</span> Blog
          </h1>
          <p className="font-[family-name:var(--font-body)] text-lg text-moselle-text-light max-w-2xl mx-auto italic">
            Dossiers, rencontres et échappées gourmandes au cœur du terroir mosellan.
          </p>
          <div className="ornament-divider mt-6">
            <span className="text-moselle-brown/40">❦</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        {/* Pillar cards — illustrated category overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {BLOG_PILLARS.map((pillar) => {
            const config: Record<string, { Icon: typeof BookOpen; tone: string; iconBg: string }> = {
              "dossier-thematique": {
                Icon: BookOpen,
                tone: "border-moselle-green/30 bg-moselle-green/5 hover:bg-moselle-green/10",
                iconBg: "bg-moselle-green text-white",
              },
              rencontre: {
                Icon: Users,
                tone: "border-moselle-brown/30 bg-moselle-brown/5 hover:bg-moselle-brown/10",
                iconBg: "bg-moselle-brown text-white",
              },
              echappee: {
                Icon: Compass,
                tone: "border-moselle-blue/30 bg-moselle-blue/5 hover:bg-moselle-blue/10",
                iconBg: "bg-moselle-blue text-white",
              },
            };
            const { Icon, tone, iconBg } = config[pillar.value] ?? config["dossier-thematique"];
            return (
              <div
                key={pillar.value}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-colors ${tone}`}
              >
                <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
                  <Icon size={22} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-[family-name:var(--font-heading)] font-bold text-lg text-moselle-text leading-tight">
                    {pillar.label}
                  </h3>
                  <p className="text-sm text-moselle-text-light italic leading-snug">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Featured article (first) */}
        {sorted[0] && (
          <Link href={`/blog/${sorted[0].slug}`} className="block mb-10 group">
            <Card borderColor="brown" className="overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[16/10] md:aspect-auto min-h-[250px] overflow-hidden">
                  <Image
                    src={sorted[0].coverImage.url}
                    alt={sorted[0].coverImage.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105 vintage-img"
                  />
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-center">
                  <Badge variant="cream" className="mb-3 self-start">
                    {BLOG_PILLARS.find((p) => p.value === sorted[0].pillar)?.label}
                  </Badge>
                  <h2 className="font-[family-name:var(--font-heading)] font-extrabold text-2xl sm:text-3xl text-moselle-text mb-3 group-hover:text-moselle-green transition-colors tracking-tight leading-tight">
                    {sorted[0].title}
                  </h2>
                  <p className="font-[family-name:var(--font-body)] italic text-moselle-text-light leading-relaxed mb-4 line-clamp-3">
                    {sorted[0].excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-moselle-text-light">
                    <span>{formatDate(sorted[0].publishedAt)}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {sorted[0].readingTime} min
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        )}

        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.slice(1).map((post, i) => {
            const pillar = BLOG_PILLARS.find((p) => p.value === post.pillar);
            return (
              <AnimatedItem key={post.id} index={i}>
                <Link href={`/blog/${post.slug}`}>
                  <Card borderColor="brown" className="h-full group card-hover-lift">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={post.coverImage.url}
                        alt={post.coverImage.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 vintage-img"
                      />
                    </div>
                    <div className="p-4">
                      <Badge variant="cream" className="mb-2">
                        {pillar?.label}
                      </Badge>
                      <h2 className="font-[family-name:var(--font-heading)] font-bold text-lg text-moselle-text mb-2 line-clamp-2 group-hover:text-moselle-green transition-colors tracking-tight">
                        {post.title}
                      </h2>
                      <p className="font-[family-name:var(--font-body)] italic text-sm text-moselle-text-light line-clamp-3 mb-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-moselle-text-light">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {post.readingTime} min
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </AnimatedItem>
            );
          })}
        </div>
      </section>
    </>
  );
}
