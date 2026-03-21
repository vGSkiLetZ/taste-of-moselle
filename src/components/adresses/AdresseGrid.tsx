"use client";

import { Suspense, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Adresse } from "@/lib/types";
import { applyFilters, type FilterState } from "@/hooks/useFilters";
import type { Category, GeoZone, BudgetLevel } from "@/lib/types";
import { getDistance } from "@/lib/utils";
import AdresseCard from "./AdresseCard";
import AdresseFilters from "./AdresseFilters";
import CompareBar from "./CompareBar";
import AnimateIn from "@/components/ui/AnimateIn";
import PullToRefresh from "@/components/ui/PullToRefresh";
import { CardSkeletonGrid } from "@/components/ui/Skeleton";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Navigation } from "lucide-react";

interface AdresseGridProps {
  adresses: Adresse[];
}

function AdresseGridInner({ adresses }: AdresseGridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { position, loading, active, requestPosition, deactivate } = useGeolocation();

  const filters: FilterState = {
    search: searchParams.get("q") ?? "",
    categories: (searchParams.get("cat")?.split(",").filter(Boolean) ?? []) as Category[],
    zone: (searchParams.get("zone") ?? "") as GeoZone | "",
    budgetMax: (Number(searchParams.get("budget")) || 0) as BudgetLevel | 0,
    sortBy: (searchParams.get("sort") ?? "score") as FilterState["sortBy"],
  };

  const filtered = applyFilters(adresses, filters);

  // Compute distances and sort by proximity if geo active
  const { items, distances } = useMemo(() => {
    if (!active || !position) {
      return { items: filtered, distances: new Map<string, number>() };
    }

    const withDist = filtered.map((a) => ({
      adresse: a,
      distance: getDistance(position.lat, position.lng, a.coordinates.lat, a.coordinates.lng),
    }));
    withDist.sort((a, b) => a.distance - b.distance);

    const distMap = new Map<string, number>();
    withDist.forEach((w) => distMap.set(w.adresse.slug, w.distance));

    return { items: withDist.map((w) => w.adresse), distances: distMap };
  }, [filtered, active, position]);

  const handleRefresh = useCallback(async () => {
    router.refresh();
    await new Promise((resolve) => setTimeout(resolve, 600));
  }, [router]);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <AdresseFilters totalResults={items.length} />
          </div>
          <button
            onClick={active ? deactivate : requestPosition}
            disabled={loading}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${
              active
                ? "bg-moselle-green text-white shadow-md"
                : "bg-moselle-cream text-moselle-text hover:bg-moselle-cream-dark"
            } ${loading ? "opacity-50" : ""}`}
          >
            <Navigation size={16} className={loading ? "animate-spin" : ""} />
            {loading ? "..." : active ? "Desactiver" : "Pres de moi"}
          </button>
        </div>

        {items.length === 0 ? (
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
            {items.map((adresse, i) => (
              <AnimateIn key={adresse.id} delay={i * 0.06}>
                <AdresseCard
                  adresse={adresse}
                  distance={distances.get(adresse.slug) ?? null}
                />
              </AnimateIn>
            ))}
          </div>
        )}
      </div>

      <CompareBar />
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
