import "dotenv/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../src/lib/db/schema";
import adressesData from "../src/data/adresses.json";
import blogPostsData from "../src/data/blog-posts.json";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const db = drizzle(client, { schema });

async function seed() {
  console.log("Seeding adresses...");

  for (const a of adressesData as any[]) {
    await db.insert(schema.adresses).values({
      id: a.id,
      slug: a.slug,
      name: a.name,
      category: a.category,
      geoZone: a.geoZone,
      tastyScore: a.tastyScore,
      scoreAccueil: a.scoreCriteria.accueil,
      scoreAssiette: a.scoreCriteria.assiette,
      scoreCadre: a.scoreCriteria.cadre,
      scoreRapportQP: a.scoreCriteria.rapportQualitePrix,
      budget: a.budget,
      petitPlus: a.petitPlus,
      description: a.description,
      coverUrl: a.coverImage.url,
      coverAlt: a.coverImage.alt,
      coverWidth: a.coverImage.width,
      coverHeight: a.coverImage.height,
      lat: a.coordinates.lat,
      lng: a.coordinates.lng,
      googleMapsId: a.googleMapsId ?? null,
      phone: a.phone ?? null,
      reservationUrl: a.reservationUrl ?? null,
      website: a.website ?? null,
      address: a.address,
      openingHours: a.openingHours ?? null,
      tags: (a.tags || []).join(","),
      publishedAt: a.publishedAt,
    });

    if (a.gallery && a.gallery.length > 0) {
      for (let i = 0; i < a.gallery.length; i++) {
        const img = a.gallery[i];
        await db.insert(schema.adresseGallery).values({
          adresseId: a.id,
          url: img.url,
          alt: img.alt,
          width: img.width,
          height: img.height,
          sortOrder: i,
        });
      }
    }

    console.log(`  + ${a.name}`);
  }

  console.log("\nSeeding blog posts...");

  for (const p of blogPostsData as any[]) {
    await db.insert(schema.blogPosts).values({
      id: p.id,
      slug: p.slug,
      title: p.title,
      pillar: p.pillar,
      excerpt: p.excerpt,
      content: p.content,
      coverUrl: p.coverImage.url,
      coverAlt: p.coverImage.alt,
      coverWidth: p.coverImage.width,
      coverHeight: p.coverImage.height,
      author: p.author,
      readingTime: p.readingTime,
      relatedAdresses: (p.relatedAdresses || []).join(","),
      tags: (p.tags || []).join(","),
      publishedAt: p.publishedAt,
    });

    console.log(`  + ${p.title}`);
  }

  console.log("\nDone! Seeded successfully.");
}

seed().catch(console.error);
