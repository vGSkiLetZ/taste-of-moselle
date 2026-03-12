import { cn } from "@/lib/utils";
import type { TastyScoreCriteria } from "@/lib/types";
import { SCORE_CRITERIA_LABELS } from "@/lib/constants";

interface TastyScoreProps {
  score: number;
  criteria?: TastyScoreCriteria;
  size?: "sm" | "md" | "lg";
  showCriteria?: boolean;
  className?: string;
}

export default function TastyScore({
  score,
  criteria,
  size = "md",
  showCriteria = false,
  className,
}: TastyScoreProps) {
  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-14 h-14 text-lg",
    lg: "w-20 h-20 text-2xl",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Circular score */}
      <div
        className={cn(
          "flex items-center justify-center rounded-full",
          "bg-moselle-green text-white font-[family-name:var(--font-heading)] font-bold",
          "shadow-[var(--shadow-button)]",
          sizeClasses[size]
        )}
      >
        {score.toFixed(1)}
      </div>

      {/* Criteria breakdown */}
      {showCriteria && criteria && (
        <div className="flex-1 space-y-1.5">
          {(Object.entries(criteria) as [keyof TastyScoreCriteria, number][]).map(
            ([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-moselle-text-light w-20 shrink-0">
                  {SCORE_CRITERIA_LABELS[key]}
                </span>
                <div className="flex-1 h-2 bg-moselle-cream-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-moselle-green rounded-full transition-all duration-500"
                    style={{ width: `${(value / 10) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-moselle-text w-6 text-right">
                  {value}
                </span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
