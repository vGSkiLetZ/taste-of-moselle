"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "./auth";
import { slugify, getReadingTime } from "@/lib/utils";

export async function createBlogPostAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  await requireAuth();

  const title = formData.get("title") as string;
  if (!title) return { error: "Le titre est requis" };

  const content = (formData.get("content") as string) || "";
  const id = crypto.randomUUID().slice(0, 8);
  const slug = (formData.get("slug") as string) || slugify(title);

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
  } catch (e: any) {
    return { error: e.message || "Erreur lors de la creation" };
  }

  revalidatePath("/");
  revalidatePath("/blog");
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

  try {
    await db
      .update(blogPosts)
      .set({
        slug: (formData.get("slug") as string) || slugify(title),
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
  } catch (e: any) {
    return { error: e.message || "Erreur lors de la mise a jour" };
  }

  revalidatePath("/");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPostAction(formData: FormData): Promise<void> {
  await requireAuth();
  const id = formData.get("id") as string;
  if (id) {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    revalidatePath("/");
    revalidatePath("/blog");
  }
  redirect("/admin/blog");
}
