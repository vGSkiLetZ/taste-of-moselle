import type { MetadataRoute } from "next";
import { getAllAdresses, getAllBlogPosts } from "@/lib/api";

const BASE_URL = "https://tasteofmoselle.fr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const adresses = await getAllAdresses();
  const posts = await getAllBlogPosts();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/adresses`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/carte`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/a-propos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const adressePages: MetadataRoute.Sitemap = adresses.map((a) => ({
    url: `${BASE_URL}/adresses/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...adressePages, ...blogPages];
}
