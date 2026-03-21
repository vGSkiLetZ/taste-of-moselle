import { requireAuth } from "@/lib/admin/auth";
import AdminNav from "@/components/admin/AdminNav";
import { db } from "@/lib/db";
import { adresses, blogPosts, siteSettings } from "@/lib/db/schema";
import { sql, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Plus, MapPin, FileText, AlertTriangle } from "lucide-react";
import { toggleMaintenanceAction } from "@/lib/admin/settings-actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAuth();

  const [adresseCount] = await db.select({ count: sql<number>`count(*)` }).from(adresses);
  const [blogCount] = await db.select({ count: sql<number>`count(*)` }).from(blogPosts);
  const recentAdresses = await db.select().from(adresses).orderBy(desc(adresses.updatedAt)).limit(5);
  const recentPosts = await db.select().from(blogPosts).orderBy(desc(blogPosts.updatedAt)).limit(5);

  // Maintenance mode
  let maintenanceOn = false;
  try {
    const rows = await db.select().from(siteSettings).where(eq(siteSettings.key, "maintenance")).limit(1);
    maintenanceOn = rows[0]?.value === "true";
  } catch {
    // Table may not exist yet
  }

  return (
    <>
      <AdminNav />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-moselle-text">
            Tableau de bord
          </h1>

          {/* Maintenance toggle */}
          <form action={toggleMaintenanceAction}>
            <button
              type="submit"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                maintenanceOn
                  ? "bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
                  : "bg-moselle-cream text-moselle-text-light border border-moselle-cream-dark hover:bg-moselle-cream-dark"
              }`}
            >
              <AlertTriangle size={16} />
              {maintenanceOn ? "🔴 Maintenance ON — Cliquer pour désactiver" : "Mode maintenance"}
            </button>
          </form>
        </div>

        {maintenanceOn && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
            <AlertTriangle size={16} />
            Le site est actuellement en mode maintenance. Les visiteurs voient une page d&apos;indisponibilité.
          </div>
        )}

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
            <h2 className="font-semibold text-moselle-text mb-3">Dernières adresses</h2>
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
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    p.status === "published" ? "bg-green-100 text-green-800" :
                    p.status === "scheduled" ? "bg-blue-100 text-blue-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {p.status === "published" ? "Publié" : p.status === "scheduled" ? "Planifié" : "Brouillon"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
