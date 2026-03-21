import { requireAuth } from "@/lib/admin/auth";
import AdminNav from "@/components/admin/AdminNav";
import DeleteButton from "@/components/admin/DeleteButton";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { deleteBlogPostAction } from "@/lib/admin/blog-actions";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  await requireAuth();

  const allPosts = await db.select().from(blogPosts).orderBy(desc(blogPosts.updatedAt));

  return (
    <>
      <AdminNav />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-moselle-text">
            Articles ({allPosts.length})
          </h1>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-1.5 bg-moselle-green text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-moselle-green/90 transition-colors"
          >
            <Plus size={16} /> Nouvel article
          </Link>
        </div>

        <div className="bg-moselle-white rounded-2xl border border-moselle-cream-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-moselle-cream/50 text-left">
                  <th className="px-4 py-3 font-semibold">Titre</th>
                  <th className="px-4 py-3 font-semibold hidden sm:table-cell">Statut</th>
                  <th className="px-4 py-3 font-semibold hidden sm:table-cell">Pilier</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Auteur</th>
                  <th className="px-4 py-3 font-semibold hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-moselle-cream-dark">
                {allPosts.map((p) => (
                  <tr key={p.id} className="hover:bg-moselle-cream/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{p.title}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        p.status === "published" ? "bg-green-100 text-green-800" :
                        p.status === "scheduled" ? "bg-blue-100 text-blue-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {p.status === "published" ? "Publié" : p.status === "scheduled" ? "Planifié" : "Brouillon"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-moselle-text-light">{p.pillar}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-moselle-text-light">{p.author}</td>
                    <td className="px-4 py-3 hidden sm:table-cell text-moselle-text-light">{p.publishedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/admin/blog/${p.id}/edit`} className="flex items-center gap-1 text-moselle-green hover:underline">
                          <Pencil size={14} /> Modifier
                        </Link>
                        <DeleteButton action={deleteBlogPostAction} id={p.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
