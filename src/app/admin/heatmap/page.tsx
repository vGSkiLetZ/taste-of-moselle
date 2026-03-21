import { requireAuth } from "@/lib/admin/auth";
import AdminNav from "@/components/admin/AdminNav";
import { db } from "@/lib/db";
import { pageViews, adresses } from "@/lib/db/schema";
import { sql, eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminHeatmapPage() {
  await requireAuth();

  // Get view counts per adresse
  const viewCounts = await db
    .select({
      slug: pageViews.pageSlug,
      views: sql<number>`count(*)`.as("views"),
    })
    .from(pageViews)
    .where(eq(pageViews.pageType, "adresse"))
    .groupBy(pageViews.pageSlug)
    .orderBy(desc(sql`count(*)`));

  // Get adresse details for each
  const allAdresses = await db.select().from(adresses);
  const adresseMap = new Map(allAdresses.map((a) => [a.slug, a]));

  const maxViews = viewCounts.length > 0 ? viewCounts[0].views : 1;

  // Blog views
  const blogViewCounts = await db
    .select({
      slug: pageViews.pageSlug,
      views: sql<number>`count(*)`.as("views"),
    })
    .from(pageViews)
    .where(eq(pageViews.pageType, "blog"))
    .groupBy(pageViews.pageSlug)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  // Zone stats
  const zoneStats = await db
    .select({
      zone: adresses.geoZone,
      count: sql<number>`count(*)`.as("count"),
    })
    .from(adresses)
    .groupBy(adresses.geoZone)
    .orderBy(desc(sql`count(*)`));

  return (
    <>
      <AdminNav />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-moselle-text mb-6">
          Heatmap des visites
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Zone breakdown */}
          <div className="bg-moselle-white rounded-2xl border border-moselle-cream-dark p-5">
            <h2 className="font-semibold text-moselle-text mb-4">Adresses par zone</h2>
            <div className="space-y-3">
              {zoneStats.map((z) => (
                <div key={z.zone} className="flex items-center gap-3">
                  <span className="text-sm text-moselle-text min-w-[140px]">{z.zone}</span>
                  <div className="flex-1 h-6 bg-moselle-cream rounded-full overflow-hidden">
                    <div
                      className="h-full bg-moselle-green rounded-full transition-all"
                      style={{ width: `${(z.count / (zoneStats[0]?.count || 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-moselle-text w-8 text-right">{z.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top blog articles */}
          <div className="bg-moselle-white rounded-2xl border border-moselle-cream-dark p-5">
            <h2 className="font-semibold text-moselle-text mb-4">Top articles (vues)</h2>
            <div className="space-y-2">
              {blogViewCounts.length === 0 ? (
                <p className="text-sm text-moselle-text-light italic">Aucune donnée</p>
              ) : (
                blogViewCounts.map((b, i) => (
                  <div key={b.slug} className="flex items-center gap-3 py-1">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? "bg-yellow-400 text-yellow-900" :
                      i === 1 ? "bg-gray-300 text-gray-700" :
                      i === 2 ? "bg-amber-600 text-white" :
                      "bg-moselle-cream text-moselle-text-light"
                    }`}>
                      {i + 1}
                    </span>
                    <span className="text-sm text-moselle-text flex-1 truncate">{b.slug}</span>
                    <span className="text-sm font-semibold text-moselle-green">{b.views}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Adresse heatmap */}
        <div className="bg-moselle-white rounded-2xl border border-moselle-cream-dark p-5">
          <h2 className="font-semibold text-moselle-text mb-4">
            Top adresses consultées
          </h2>
          <div className="space-y-2">
            {viewCounts.length === 0 ? (
              <p className="text-sm text-moselle-text-light italic">Aucune visite enregistrée</p>
            ) : (
              viewCounts.slice(0, 20).map((vc, i) => {
                const adresse = adresseMap.get(vc.slug);
                const intensity = vc.views / maxViews;
                return (
                  <div key={vc.slug} className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      i === 0 ? "bg-red-500 text-white" :
                      i === 1 ? "bg-orange-500 text-white" :
                      i === 2 ? "bg-yellow-500 text-white" :
                      "bg-moselle-cream text-moselle-text-light"
                    }`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-moselle-text truncate">
                        {adresse?.name || vc.slug}
                      </p>
                      <div className="h-1.5 bg-moselle-cream rounded-full mt-1">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${intensity * 100}%`,
                            backgroundColor: `hsl(${(1 - intensity) * 120}, 70%, 45%)`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-moselle-text">{vc.views} vues</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
