import { requireAuth } from "@/lib/admin/auth";
import AdminNav from "@/components/admin/AdminNav";
import { db } from "@/lib/db";
import { pageViews, adresses, blogPosts } from "@/lib/db/schema";
import { sql, eq, desc, and, gte } from "drizzle-orm";
import { BarChart3, Eye, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  await requireAuth();

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // Total views
  const [totalAll] = await db.select({ count: sql<number>`count(*)` }).from(pageViews);
  const [total7d] = await db
    .select({ count: sql<number>`count(*)` })
    .from(pageViews)
    .where(gte(pageViews.viewedAt, sevenDaysAgo));
  const [total30d] = await db
    .select({ count: sql<number>`count(*)` })
    .from(pageViews)
    .where(gte(pageViews.viewedAt, thirtyDaysAgo));

  // Top adresses
  const topAdresses = await db
    .select({
      slug: pageViews.pageSlug,
      views: sql<number>`count(*)`,
    })
    .from(pageViews)
    .where(eq(pageViews.pageType, "adresse"))
    .groupBy(pageViews.pageSlug)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  // Get adresse names
  const adresseNames: Record<string, string> = {};
  if (topAdresses.length > 0) {
    const allAddr = await db.select({ slug: adresses.slug, name: adresses.name }).from(adresses);
    allAddr.forEach((a) => { adresseNames[a.slug] = a.name; });
  }

  // Top blog posts
  const topPosts = await db
    .select({
      slug: pageViews.pageSlug,
      views: sql<number>`count(*)`,
    })
    .from(pageViews)
    .where(eq(pageViews.pageType, "blog"))
    .groupBy(pageViews.pageSlug)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  const postNames: Record<string, string> = {};
  if (topPosts.length > 0) {
    const allPosts = await db.select({ slug: blogPosts.slug, title: blogPosts.title }).from(blogPosts);
    allPosts.forEach((p) => { postNames[p.slug] = p.title; });
  }

  const maxAdresseViews = topAdresses[0]?.views || 1;
  const maxPostViews = topPosts[0]?.views || 1;

  return (
    <>
      <AdminNav />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-moselle-text mb-8">
          <BarChart3 size={28} className="inline mr-2 text-moselle-green" />
          Analytics
        </h1>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-moselle-white rounded-2xl p-6 shadow-sm border border-moselle-cream-dark text-center">
            <Eye className="text-moselle-green mx-auto mb-2" size={24} />
            <p className="text-3xl font-bold text-moselle-green">{total7d.count}</p>
            <p className="text-sm text-moselle-text-light">7 derniers jours</p>
          </div>
          <div className="bg-moselle-white rounded-2xl p-6 shadow-sm border border-moselle-cream-dark text-center">
            <TrendingUp className="text-moselle-green mx-auto mb-2" size={24} />
            <p className="text-3xl font-bold text-moselle-green">{total30d.count}</p>
            <p className="text-sm text-moselle-text-light">30 derniers jours</p>
          </div>
          <div className="bg-moselle-white rounded-2xl p-6 shadow-sm border border-moselle-cream-dark text-center">
            <BarChart3 className="text-moselle-green mx-auto mb-2" size={24} />
            <p className="text-3xl font-bold text-moselle-green">{totalAll.count}</p>
            <p className="text-sm text-moselle-text-light">Total</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top adresses */}
          <div>
            <h2 className="font-semibold text-moselle-text mb-4">Top adresses</h2>
            {topAdresses.length === 0 ? (
              <p className="text-sm text-moselle-text-light">Pas encore de donnees.</p>
            ) : (
              <div className="space-y-2">
                {topAdresses.map((item) => (
                  <div key={item.slug} className="bg-moselle-white rounded-xl p-3 border border-moselle-cream-dark">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-moselle-text truncate flex-1 mr-2">
                        {adresseNames[item.slug] || item.slug}
                      </span>
                      <span className="text-xs text-moselle-text-light shrink-0">{item.views} vues</span>
                    </div>
                    <div className="h-2 bg-moselle-cream-dark rounded-full overflow-hidden">
                      <div
                        className="h-full bg-moselle-green rounded-full"
                        style={{ width: `${(item.views / maxAdresseViews) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top articles */}
          <div>
            <h2 className="font-semibold text-moselle-text mb-4">Top articles</h2>
            {topPosts.length === 0 ? (
              <p className="text-sm text-moselle-text-light">Pas encore de donnees.</p>
            ) : (
              <div className="space-y-2">
                {topPosts.map((item) => (
                  <div key={item.slug} className="bg-moselle-white rounded-xl p-3 border border-moselle-cream-dark">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-moselle-text truncate flex-1 mr-2">
                        {postNames[item.slug] || item.slug}
                      </span>
                      <span className="text-xs text-moselle-text-light shrink-0">{item.views} vues</span>
                    </div>
                    <div className="h-2 bg-moselle-cream-dark rounded-full overflow-hidden">
                      <div
                        className="h-full bg-moselle-green rounded-full"
                        style={{ width: `${(item.views / maxPostViews) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
