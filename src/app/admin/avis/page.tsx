import { requireAuth } from "@/lib/admin/auth";
import AdminNav from "@/components/admin/AdminNav";
import { db } from "@/lib/db";
import { reviews, adresses } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Star, Check, Trash2 } from "lucide-react";
import { approveReviewAction, deleteReviewAction } from "@/lib/admin/review-actions";

export const dynamic = "force-dynamic";

export default async function AdminAvisPage() {
  await requireAuth();

  const allReviews = await db
    .select({
      review: reviews,
      adresseName: adresses.name,
      adresseSlug: adresses.slug,
    })
    .from(reviews)
    .leftJoin(adresses, eq(reviews.adresseId, adresses.id))
    .orderBy(desc(reviews.createdAt));

  const pendingReviews = allReviews.filter((r) => !r.review.approved);
  const approvedReviews = allReviews.filter((r) => r.review.approved);

  return (
    <>
      <AdminNav />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-moselle-text mb-6">
          Gestion des avis
        </h1>

        {/* Pending reviews */}
        <div className="mb-10">
          <h2 className="font-semibold text-moselle-text mb-3 flex items-center gap-2">
            En attente de moderation
            {pendingReviews.length > 0 && (
              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingReviews.length}
              </span>
            )}
          </h2>

          {pendingReviews.length === 0 ? (
            <p className="text-moselle-text-light text-sm bg-moselle-cream rounded-xl p-4">
              Aucun avis en attente.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingReviews.map(({ review, adresseName }) => (
                <div
                  key={review.id}
                  className="bg-moselle-white rounded-2xl border border-orange-200 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{review.pseudo}</span>
                        <span className="text-xs text-moselle-text-light">sur</span>
                        <span className="text-xs font-medium text-moselle-green">{adresseName}</span>
                      </div>
                      <div className="flex mb-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      {review.comment && (
                        <p className="text-sm text-moselle-text mt-1">{review.comment}</p>
                      )}
                      <p className="text-xs text-moselle-text-light mt-1">
                        {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <form action={async () => { "use server"; await approveReviewAction(review.id); }}>
                        <button
                          type="submit"
                          className="flex items-center gap-1 bg-moselle-green text-white text-xs px-3 py-1.5 rounded-lg hover:bg-moselle-green/90 transition-colors"
                        >
                          <Check size={14} /> Approuver
                        </button>
                      </form>
                      <form action={async () => { "use server"; await deleteReviewAction(review.id); }}>
                        <button
                          type="submit"
                          className="flex items-center gap-1 bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={14} /> Supprimer
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approved reviews */}
        <div>
          <h2 className="font-semibold text-moselle-text mb-3">
            Avis approuves ({approvedReviews.length})
          </h2>
          <div className="bg-moselle-white rounded-2xl border border-moselle-cream-dark divide-y divide-moselle-cream-dark">
            {approvedReviews.length === 0 ? (
              <p className="text-moselle-text-light text-sm p-4">Aucun avis approuve.</p>
            ) : (
              approvedReviews.map(({ review, adresseName }) => (
                <div key={review.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{review.pseudo}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={12} className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                      <span className="text-xs text-moselle-text-light">— {adresseName}</span>
                    </div>
                  </div>
                  <form action={async () => { "use server"; await deleteReviewAction(review.id); }}>
                    <button type="submit" className="text-red-400 hover:text-red-600 transition-colors p-1">
                      <Trash2 size={14} />
                    </button>
                  </form>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
