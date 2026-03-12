"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CATEGORIES, GEO_ZONES, BUDGET_LABELS } from "@/lib/constants";
import { useFilters, type FilterState } from "@/hooks/useFilters";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import CategoryIcon from "@/components/ui/CategoryIcon";
import type { Category } from "@/lib/types";

interface AdresseFiltersProps {
  totalResults: number;
}

export default function AdresseFilters({ totalResults }: AdresseFiltersProps) {
  const { filters, setFilter, resetFilters, toggleCategory } = useFilters();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const hasActiveFilters =
    filters.categories.length > 0 || filters.zone || filters.budgetMax || filters.search;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-moselle-text-light"
        />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
          placeholder="Rechercher un restaurant, un plat, une ville..."
          className="w-full pl-12 pr-4 py-3.5 rounded-full border-2 border-moselle-cream-dark bg-moselle-white text-moselle-text placeholder:text-moselle-text-light/60 focus:outline-none focus:border-moselle-green transition-colors text-base"
        />
      </div>

      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between md:hidden">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-moselle-cream-dark text-sm font-semibold text-moselle-text touch-target"
        >
          <SlidersHorizontal size={16} />
          Filtrer
          {hasActiveFilters && (
            <span className="w-5 h-5 bg-moselle-green text-white rounded-full text-xs flex items-center justify-center">
              {filters.categories.length + (filters.zone ? 1 : 0) + (filters.budgetMax ? 1 : 0)}
            </span>
          )}
        </button>
        <span className="text-sm text-moselle-text-light">
          {totalResults} résultat{totalResults !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Desktop filters (always visible) + Mobile filters (collapsible) */}
      <AnimatePresence>
        {(showMobileFilters || true) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={cn(
              "space-y-4 overflow-hidden",
              !showMobileFilters && "hidden md:block"
            )}
          >
            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-moselle-text-light mb-2">
                Catégorie
              </h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const isActive = filters.categories.includes(cat.value);
                  return (
                    <button
                      key={cat.value}
                      onClick={() => toggleCategory(cat.value)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all touch-target",
                        isActive
                          ? "bg-moselle-green text-white shadow-sm"
                          : "bg-moselle-cream text-moselle-text-light hover:bg-moselle-cream-dark"
                      )}
                    >
                      <CategoryIcon
                        category={cat.value}
                        size={14}
                        className={isActive ? "text-white" : undefined}
                      />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zone + Budget row */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Zone */}
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-moselle-text-light mb-2">
                  Zone
                </h3>
                <select
                  value={filters.zone}
                  onChange={(e) => setFilter("zone", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border-2 border-moselle-cream-dark bg-moselle-white text-moselle-text text-sm focus:outline-none focus:border-moselle-green transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Toute la Moselle</option>
                  {GEO_ZONES.map((z) => (
                    <option key={z.value} value={z.value}>
                      {z.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-moselle-text-light mb-2">
                  Budget max
                </h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((level) => (
                    <button
                      key={level}
                      onClick={() =>
                        setFilter("budgetMax", filters.budgetMax === level ? 0 : level)
                      }
                      className={cn(
                        "flex-1 py-2.5 rounded-full text-sm font-semibold transition-all touch-target",
                        filters.budgetMax === level
                          ? "bg-moselle-brown text-white"
                          : "bg-moselle-cream text-moselle-text-light hover:bg-moselle-cream-dark"
                      )}
                    >
                      {BUDGET_LABELS[level]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sort + Reset */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-moselle-text-light">Trier par :</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilter("sortBy", e.target.value)}
                  className="px-3 py-1.5 rounded-full border border-moselle-cream-dark bg-moselle-white text-sm text-moselle-text focus:outline-none focus:border-moselle-green appearance-none cursor-pointer"
                >
                  <option value="score">Tasty Score</option>
                  <option value="name">Nom</option>
                  <option value="budget">Budget</option>
                  <option value="recent">Plus récent</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-sm text-moselle-red hover:text-moselle-red/80 transition-colors"
                >
                  <X size={14} />
                  Effacer les filtres
                </button>
              )}
            </div>

            {/* Results count (desktop) */}
            <p className="hidden md:block text-sm text-moselle-text-light">
              {totalResults} résultat{totalResults !== 1 ? "s" : ""}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
