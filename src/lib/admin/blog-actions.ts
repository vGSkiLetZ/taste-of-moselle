"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "./auth";
import { getReadingTime } from "@/lib/utils";
import { ensureUniqueSlug } from "./slug";
import { logAction } from "./log";

export async function createBlogPostAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  await requireAuth();

  const title = formData.get("title") as string;
  if (!title) return { error: "Le titre est requis" };

  const content = (formData.get("content") as string) || "";
  const id = crypto.randomUUID().slice(0, 8);
  const desiredSlug = (formData.get("slug") as string) || title;
  const slug = await ensureUniqueSlug("blogPosts", desiredSlug, { fallbackSource: title });

  try {
    await db.insert(blogPosts).values({
      id,
      slug,
      title,
      pillar: (formData.get("pillar") as string) || "dossier-thematique",
      excerpt: (formData.get("excerpt") as string) || "",
      content,
      coverUrl: (formData.get("coverUrl") as string) || "/images/hero/placeholder-blog.png",
      coverAlt: (formData.get("coverAlt") as string) || title,
      coverWidth: Number(formData.get("coverWidth")) || 800,
      coverHeight: Number(formData.get("coverHeight")) || 600,
      author: (formData.get("author") as string) || "Les Tasty",
      readingTime: getReadingTime(content),
      relatedAdresses: (formData.get("relatedAdresses") as string) || "",
      tags: (formData.get("tags") as string) || "",
      status: (formData.get("status") as string) || "draft",
      publishedAt: (formData.get("publishedAt") as string) || new Date().toISOString().split("T")[0],
    });
    await logAction("create", "blog", id, title);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erreur lors de la creation";
    return { error: message };
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/admin/blog");
}

export async function updateBlogPostAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  await requireAuth();

  const id = formData.get("id") as string;
  if (!id) return { error: "ID manquant" };

  const title = formData.get("title") as string;
  if (!title) return { error: "Le titre est requis" };

  const content = (formData.get("content") as string) || "";
  const desiredSlug = (formData.get("slug") as string) || title;
  const slug = await ensureUniqueSlug("blogPosts", desiredSlug, {
    fallbackSource: title,
    excludeId: id,
  });

  try {
    await db
      .update(blogPosts)
      .set({
        slug,
        title,
        pillar: (formData.get("pillar") as string) || "dossier-thematique",
        excerpt: (formData.get("excerpt") as string) || "",
        content,
        coverUrl: (formData.get("coverUrl") as string) || "/images/hero/placeholder-blog.png",
        coverAlt: (formData.get("coverAlt") as string) || title,
        coverWidth: Number(formData.get("coverWidth")) || 800,
        coverHeight: Number(formData.get("coverHeight")) || 600,
        author: (formData.get("author") as string) || "Les Tasty",
        readingTime: getReadingTime(content),
        relatedAdresses: (formData.get("relatedAdresses") as string) || "",
        tags: (formData.get("tags") as string) || "",
        status: (formData.get("status") as string) || "draft",
        publishedAt: (formData.get("publishedAt") as string) || new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString(),
      })
      .where(eq(blogPosts.id, id));
    await logAction("update", "blog", id, title);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erreur lors de la mise a jour";
    return { error: message };
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/admin/blog");
}

export async function duplicateBlogPostAction(formData: FormData): Promise<void> {
  await requireAuth();
  const id = formData.get("id") as string;
  if (!id) redirect("/admin/blog");

  const rows = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  if (rows.length === 0) redirect("/admin/blog");

  const original = rows[0];
  const newId = crypto.randomUUID().slice(0, 8);
  const newSlug = await ensureUniqueSlug("blogPosts", `${original.slug}-copie`, {
    fallbackSource: original.title,
  });

  await db.insert(blogPosts).values({
    ...original,
    id: newId,
    slug: newSlug,
    title: `${original.title} (copie)`,
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  revalidatePath("/admin/blog");
  redirect(`/admin/blog/${newId}/edit`);
}

export async function deleteBlogPostAction(formData: FormData): Promise<void> {
  await requireAuth();
  const id = formData.get("id") as string;
  if (id) {
    const existing = await db
      .select({ slug: blogPosts.slug, title: blogPosts.title })
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    if (existing[0]) {
      await logAction("delete", "blog", id, existing[0].title);
      revalidatePath(`/blog/${existing[0].slug}`);
    }
    revalidatePath("/");
    revalidatePath("/blog");
  }
  redirect("/admin/blog");
}
