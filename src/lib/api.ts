import type { Adresse, BlogPost, BlogPillar, ImageAsset, BudgetLevel, Category, GeoZone } from "./types";
import { db } from "./db";
import { adresses, adresseGallery, blogPosts } from "./db/schema";
import { eq, desc, asc, sql, or, and, lte } from "drizzle-orm";

// ===== Row → Interface Helpers =====

function rowToAdresse(row: typeof adresses.$inferSelect, gallery: ImageAsset[] = []): Adresse {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as Category,
    geoZone: row.geoZone as GeoZone,
    tastyScore: row.tastyScore,
    scoreCriteria: {
      accueil: row.scoreAccueil,
      assiette: row.scoreAssiette,
      cadre: row.scoreCadre,
      rapportQualitePrix: row.scoreRapportQP,
    },
    budget: row.budget as BudgetLevel,
    petitPlus: row.petitPlus,
    description: row.description,
    coverImage: {
      url: row.coverUrl,
      alt: row.coverAlt,
      width: row.coverWidth,
      height: row.coverHeight,
    },
    gallery,
    coordinates: { lat: row.lat, lng: row.lng },
    googleMapsId: row.googleMapsId ?? undefined,
    phone: row.phone ?? undefined,
    reservationUrl: row.reservationUrl ?? undefined,
    website: row.website ?? undefined,
    address: row.address,
    openingHours: row.openingHours ?? undefined,
    tags: row.tags ? row.tags.split(",") : [],
    publishedAt: row.publishedAt,
  };
}

function rowToBlogPost(row: typeof blogPosts.$inferSelect): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    pillar: row.pillar as BlogPillar,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: {
      url: row.coverUrl,
      alt: row.coverAlt,
      width: row.coverWidth,
      height: row.coverHeight,
    },
    author: row.author,
    publishedAt: row.publishedAt,
    readingTime: row.readingTime,
    relatedAdresses: row.relatedAdresses ? row.relatedAdresses.split(",") : [],
    tags: row.tags ? row.tags.split(",") : [],
  };
}

// ===== Adresses =====

export async function getAllAdresses(): Promise<Adresse[]> {
  const rows = await db.select().from(adresses).orderBy(asc(adresses.name));
  return rows.map((r) => rowToAdresse(r));
}

export async function getAdresseBySlug(slug: string): Promise<Adresse | undefined> {
  const rows = await db.select().from(adresses).where(eq(adresses.slug, slug)).limit(1);
  if (rows.length === 0) return undefined;
  const row = rows[0];
  const galleryRows = await db
    .select()
    .from(adresseGallery)
    .where(eq(adresseGallery.adresseId, row.id))
    .orderBy(asc(adresseGallery.sortOrder));
  const gallery: ImageAsset[] = galleryRows.map((g) => ({
    url: g.url,
    alt: g.alt,
    width: g.width,
    height: g.height,
  }));
  return rowToAdresse(row, gallery);
}

export async function getAdressesByCategory(category: string): Promise<Adresse[]> {
  const rows = await db.select().from(adresses).where(eq(adresses.category, category));
  return rows.map((r) => rowToAdresse(r));
}

export async function getAdressesByZone(zone: string): Promise<Adresse[]> {
  const rows = await db.select().from(adresses).where(eq(adresses.geoZone, zone));
  return rows.map((r) => rowToAdresse(r));
}

export async function getFeaturedAdresses(limit = 4): Promise<Adresse[]> {
  const rows = await db
    .select()
    .from(adresses)
    .orderBy(desc(adresses.tastyScore))
    .limit(limit);
  return rows.map((r) => rowToAdresse(r));
}

// ===== Blog Posts =====

// Only return visible posts: published OR scheduled with date <= now
const visiblePostCondition = or(
  eq(blogPosts.status, "published"),
  and(eq(blogPosts.status, "scheduled"), lte(blogPosts.publishedAt, sql`(date('now'))`))
);

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const rows = await db
    .select()
    .from(blogPosts)
    .where(visiblePostCondition)
    .orderBy(desc(blogPosts.publishedAt));
  return rows.map(rowToBlogPost);
}

// Admin: get ALL posts regardless of status
export async function getAllBlogPostsAdmin(): Promise<(BlogPost & { status: string })[]> {
  const rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
  return rows.map((r) => ({ ...rowToBlogPost(r), status: r.status }));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return rows.length > 0 ? rowToBlogPost(rows[0]) : undefined;
}

export async function getBlogPostsByPillar(pillar: BlogPillar): Promise<BlogPost[]> {
  const rows = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.pillar, pillar), visiblePostCondition))
    .orderBy(desc(blogPosts.publishedAt));
  return rows.map(rowToBlogPost);
}

export async function getLatestBlogPosts(limit = 3): Promise<BlogPost[]> {
  const rows = await db
    .select()
    .from(blogPosts)
    .where(visiblePostCondition)
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit);
  return rows.map(rowToBlogPost);
}
