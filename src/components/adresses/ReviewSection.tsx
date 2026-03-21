import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { Star } from "lucide-react";
import { formatDate } from "@/lib/utils";
import ReviewForm from "./ReviewForm";

interface ReviewSectionProps {
  adresseId: string;
}

export default async function ReviewSection({ adresseId }: ReviewSectionProps) {
  const approvedReviews = await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.adresseId, adresseId), eq(reviews.approved, true)))
    .orderBy(desc(reviews.createdAt))
    .limit(20);

  const avgRating =
    approvedReviews.length > 0
      ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Average rating */}
      {approvedReviews.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                className={
                  star <= Math.round(avgRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-moselle-cream-dark"
                }
              />
            ))}
          </div>
          <span className="text-sm text-moselle-text-light">
            {avgRating.toFixed(1)} / 5 ({approvedReviews.length} avis)
          </span>
        </div>
      )}

      {/* Reviews list */}
      {approvedReviews.map((review) => (
        <div
          key={review.id}
          className="border-b border-moselle-cream-dark pb-4 last:border-0"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-sm text-moselle-text">{review.pseudo}</span>
            <span className="text-xs text-moselle-text-light">{formatDate(review.createdAt)}</span>
          </div>
          <div className="flex mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={
                  star <= review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-moselle-cream-dark"
                }
              />
            ))}
          </div>
          {review.comment && (
            <p className="text-sm text-moselle-text leading-relaxed">{review.comment}</p>
          )}
        </div>
      ))}

      {/* Review form */}
      <ReviewForm adresseId={adresseId} />
    </div>
  );
}
