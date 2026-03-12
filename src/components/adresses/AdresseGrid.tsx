"use client";

import { Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Adresse } from "@/lib/types";
import { applyFilters, type FilterState } from "@/hooks/useFilters";
import type { Category, GeoZone, BudgetLevel } from "@/lib/types";
import AdresseCard from "./AdresseCard";
import AdresseFilters from "./AdresseFilters";
import AnimateIn from "@/components/ui/AnimateIn";
import PullToRefresh from "@/components/ui/PullToRefresh";
import { CardSkeletonGrid } from "@/components/ui/Skeleton";

interface AdresseGridProps {
  adresses: Adresse[];
}

function AdresseGridInner({ adresses }: AdresseGridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters: FilterState = {
    search: searchParams.get("q") ?? "",
    categories: (searchParams.get("cat")?.split(",").filter(Boolean) ?? []) as Category[],
    zone: (searchParams.get("zone") ?? "") as GeoZone | "",
    budgetMax: (Number(searchParams.get("budget")) || 0) as BudgetLevel | 0,
    sortBy: (searchParams.get("sort") ?? "score") as FilterState["sortBy"],
  };

  const filtered = applyFilters(adresses, filters);

  const handleRefresh = useCallback(async () => {
    router.refresh();
    await new Promise((resolve) => setTimeout(resolve, 600));
  }, [router]);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-6">
        <AdresseFilters totalResults={filtered.length} />

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-[family-name:var(--font-heading)] text-xl text-moselle-text-light mb-2">
              Aucune adresse trouvée
            </p>
            <p className="text-sm text-moselle-text-light">
              Essayez de modifier vos filtres pour découvrir plus d&apos;adresses.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((adresse, i) => (
              <AnimateIn key={adresse.id} delay={i * 0.06}>
                <AdresseCard adresse={adresse} />
              </AnimateIn>
            ))}
          </div>
        )}
      </div>
    </PullToRefresh>
  );
}

export default function AdresseGrid({ adresses }: AdresseGridProps) {
  return (
    <Suspense fallback={<CardSkeletonGrid count={6} />}>
      <AdresseGridInner adresses={adresses} />
    </Suspense>
  );
}
