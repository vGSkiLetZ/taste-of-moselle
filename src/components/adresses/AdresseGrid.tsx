"use client";

import { Suspense, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Adresse } from "@/lib/types";
import { applyFilters, type FilterState } from "@/hooks/useFilters";
import type { Category, GeoZone, BudgetLevel } from "@/lib/types";
import { getDistance } from "@/lib/utils";
import AdresseCard from "./AdresseCard";
import AdresseFilters from "./AdresseFilters";
import BottomSheetFilters from "./BottomSheetFilters";
import CompareBar from "./CompareBar";
import AnimateIn from "@/components/ui/AnimateIn";
import PullToRefresh from "@/components/ui/PullToRefresh";
import { CardSkeletonGrid } from "@/components/ui/Skeleton";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Navigation, Search } from "lucide-react";

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
        {/* Desktop filters */}
        <div className="hidden md:flex items-center gap-3">
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
            {loading ? "..." : active ? "Désactiver" : "Près de moi"}
          </button>
        </div>

        {/* Mobile: search + bottom sheet + geo */}
        <div className="md:hidden space-y-3">
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-moselle-text-light" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => {
                const params = new URLSearchParams(window.location.search);
                if (e.target.value) params.set("q", e.target.value);
                else params.delete("q");
                window.history.replaceState(null, "", `?${params.toString()}`);
                router.refresh();
              }}
              placeholder="Rechercher..."
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-moselle-cream-dark bg-moselle-white text-moselle-text placeholder:text-moselle-text-light/60 focus:outline-none focus:border-moselle-green transition-colors text-base"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BottomSheetFilters totalResults={items.length} />
              <button
                onClick={active ? deactivate : requestPosition}
                disabled={loading}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-full text-sm font-medium transition-all ${
                  active
                    ? "bg-moselle-green text-white shadow-md"
                    : "border-2 border-moselle-cream-dark text-moselle-text"
                } ${loading ? "opacity-50" : ""}`}
              >
                <Navigation size={16} className={loading ? "animate-spin" : ""} />
                {loading ? "..." : active ? "Off" : "Près de moi"}
              </button>
            </div>
            <span className="text-sm text-moselle-text-light">
              {items.length} résultat{items.length !== 1 ? "s" : ""}
            </span>
          </div>
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
