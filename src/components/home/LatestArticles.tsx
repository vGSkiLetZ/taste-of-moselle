"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { BLOG_PILLARS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import SectionDivider from "@/components/ui/SectionDivider";

interface LatestArticlesProps {
  posts: BlogPost[];
}

export default function LatestArticles({ posts }: LatestArticlesProps) {
  return (
    <section className="section-cream py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionDivider />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-8 mt-6"
        >
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-extrabold text-moselle-text section-heading tracking-tight">
              <span className="italic">Derniers</span> articles
            </h2>
            <p className="font-[family-name:var(--font-accent)] text-2xl text-moselle-text-light mt-1">
              Nos aventures les plus récentes
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-1.5 font-[family-name:var(--font-heading)] text-sm font-semibold italic text-moselle-green hover:text-moselle-green-light transition-colors group"
          >
            Tous les articles
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => {
            const pillar = BLOG_PILLARS.find((p) => p.value === post.pillar);
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <Card borderColor="brown" className="h-full card-hover-lift">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={post.coverImage.url}
                        alt={post.coverImage.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover vintage-img transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <Badge variant="cream" className="mb-2">
                        {pillar?.label ?? post.pillar}
                      </Badge>
                      <h3 className="font-[family-name:var(--font-heading)] font-bold text-lg text-moselle-text mb-2 line-clamp-2 leading-snug tracking-tight">
                        {post.title}
                      </h3>
                      <p className="font-[family-name:var(--font-body)] text-sm italic text-moselle-text-light line-clamp-2 mb-3">
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
              </motion.div>
            );
          })}
        </div>

        <Link
          href="/blog"
          className="flex sm:hidden items-center justify-center gap-1.5 mt-6 text-sm font-semibold text-moselle-green"
        >
          Voir tous les articles
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
