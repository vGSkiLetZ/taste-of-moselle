"use client";

import { cn } from "@/lib/utils";
import type { TastyScoreCriteria } from "@/lib/types";
import { SCORE_CRITERIA_LABELS } from "@/lib/constants";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import AnimatedCounter from "./AnimatedCounter";

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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-14 h-14 text-lg",
    lg: "w-20 h-20 text-2xl",
  };

  return (
    <div ref={ref} className={cn("flex items-center gap-3", className)}>
      {/* Circular score with scale animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className={cn(
          "flex items-center justify-center rounded-full",
          "bg-moselle-green text-white font-[family-name:var(--font-heading)] font-bold",
          "shadow-[var(--shadow-button)]",
          sizeClasses[size]
        )}
      >
        <AnimatedCounter value={score} decimals={1} duration={900} />
      </motion.div>

      {/* Criteria breakdown with animated bars */}
      {showCriteria && criteria && (
        <div className="flex-1 space-y-1.5">
          {(Object.entries(criteria) as [keyof TastyScoreCriteria, number][]).map(
            ([key, value], index) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-moselle-text-light w-20 shrink-0">
                  {SCORE_CRITERIA_LABELS[key]}
                </span>
                <div className="flex-1 h-2 bg-moselle-cream-dark rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-moselle-green rounded-full"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${(value / 10) * 100}%` } : {}}
                    transition={{
                      duration: 0.7,
                      delay: 0.2 + index * 0.1,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-moselle-text w-6 text-right">
                  {isInView ? value : 0}
                </span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
