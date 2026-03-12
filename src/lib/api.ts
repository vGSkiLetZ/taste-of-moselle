import type { Adresse, BlogPost, BlogPillar } from "./types";
import adressesData from "@/data/adresses.json";
import blogPostsData from "@/data/blog-posts.json";

// ===== Adresses =====

export async function getAllAdresses(): Promise<Adresse[]> {
  return adressesData as Adresse[];
}

export async function getAdresseBySlug(slug: string): Promise<Adresse | undefined> {
  const adresses = await getAllAdresses();
  return adresses.find((a) => a.slug === slug);
}

export async function getAdressesByCategory(category: string): Promise<Adresse[]> {
  const adresses = await getAllAdresses();
  return adresses.filter((a) => a.category === category);
}

export async function getAdressesByZone(zone: string): Promise<Adresse[]> {
  const adresses = await getAllAdresses();
  return adresses.filter((a) => a.geoZone === zone);
}

export async function getFeaturedAdresses(limit = 4): Promise<Adresse[]> {
  const adresses = await getAllAdresses();
  return adresses.sort((a, b) => b.tastyScore - a.tastyScore).slice(0, limit);
}

// ===== Blog Posts =====

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return blogPostsData as BlogPost[];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getAllBlogPosts();
  return posts.find((p) => p.slug === slug);
}

export async function getBlogPostsByPillar(pillar: BlogPillar): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.filter((p) => p.pillar === pillar);
}

export async function getLatestBlogPosts(limit = 3): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}
