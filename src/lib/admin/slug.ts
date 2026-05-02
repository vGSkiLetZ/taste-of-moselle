import { db } from "@/lib/db";
import { adresses, blogPosts } from "@/lib/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { slugify } from "@/lib/utils";

type Table = "adresses" | "blogPosts";

async function slugExists(table: Table, slug: string, excludeId?: string): Promise<boolean> {
  if (table === "adresses") {
    const condition = excludeId
      ? and(eq(adresses.slug, slug), ne(adresses.id, excludeId))
      : eq(adresses.slug, slug);
    const rows = await db.select({ id: adresses.id }).from(adresses).where(condition).limit(1);
    return rows.length > 0;
  }
  const condition = excludeId
    ? and(eq(blogPosts.slug, slug), ne(blogPosts.id, excludeId))
    : eq(blogPosts.slug, slug);
  const rows = await db.select({ id: blogPosts.id }).from(blogPosts).where(condition).limit(1);
  return rows.length > 0;
}

export async function ensureUniqueSlug(
  table: Table,
  desired: string,
  options: { fallbackSource: string; excludeId?: string } = { fallbackSource: "" }
): Promise<string> {
  const base = slugify(desired || options.fallbackSource) || "untitled";
  let candidate = base;
  let suffix = 2;
  while (await slugExists(table, candidate, options.excludeId)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
    if (suffix > 1000) {
      // Pathological case — give up with a random tail.
      return `${base}-${Math.random().toString(36).slice(2, 6)}`;
    }
  }
  return candidate;
}
