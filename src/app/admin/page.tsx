import { requireAuth } from "@/lib/admin/auth";
import AdminNav from "@/components/admin/AdminNav";
import { db } from "@/lib/db";
import { adresses, blogPosts } from "@/lib/db/schema";
import { sql, desc } from "drizzle-orm";
import Link from "next/link";
import { Plus, MapPin, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAuth();

  const [adresseCount] = await db.select({ count: sql<number>`count(*)` }).from(adresses);
  const [blogCount] = await db.select({ count: sql<number>`count(*)` }).from(blogPosts);
  const recentAdresses = await db.select().from(adresses).orderBy(desc(adresses.updatedAt)).limit(5);
  const recentPosts = await db.select().from(blogPosts).orderBy(desc(blogPosts.updatedAt)).limit(5);

  return (
    <>
      <AdminNav />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-moselle-text mb-8">
          Tableau de bord
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-moselle-white rounded-2xl p-6 shadow-sm border border-moselle-cream-dark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-moselle-green">{adresseCount.count}</p>
                <p className="text-moselle-text-light">Adresses</p>
              </div>
              <MapPin className="text-moselle-green" size={32} />
            </div>
            <Link href="/admin/adresses/new" className="inline-flex items-center gap-1 mt-3 text-sm text-moselle-green hover:underline">
              <Plus size={14} /> Nouvelle adresse
            </Link>
          </div>
          <div className="bg-moselle-white rounded-2xl p-6 shadow-sm border border-moselle-cream-dark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-moselle-green">{blogCount.count}</p>
                <p className="text-moselle-text-light">Articles</p>
              </div>
              <FileText className="text-moselle-green" size={32} />
            </div>
            <Link href="/admin/blog/new" className="inline-flex items-center gap-1 mt-3 text-sm text-moselle-green hover:underline">
              <Plus size={14} /> Nouvel article
            </Link>
          </div>
        </div>

        {/* Recent items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold text-moselle-text mb-3">Dernieres adresses</h2>
            <div className="bg-moselle-white rounded-2xl border border-moselle-cream-dark divide-y divide-moselle-cream-dark">
              {recentAdresses.map((a) => (
                <Link key={a.id} href={`/admin/adresses/${a.id}/edit`} className="flex items-center justify-between px-4 py-3 hover:bg-moselle-cream/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
                  <span className="text-sm">{a.name}</span>
                  <span className="text-xs text-moselle-text-light">{a.category}</span>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-moselle-text mb-3">Derniers articles</h2>
            <div className="bg-moselle-white rounded-2xl border border-moselle-cream-dark divide-y divide-moselle-cream-dark">
              {recentPosts.map((p) => (
                <Link key={p.id} href={`/admin/blog/${p.id}/edit`} className="flex items-center justify-between px-4 py-3 hover:bg-moselle-cream/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
                  <span className="text-sm">{p.title}</span>
                  <span className="text-xs text-moselle-text-light">{p.pillar}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
