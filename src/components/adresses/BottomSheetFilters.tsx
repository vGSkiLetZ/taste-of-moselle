"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { cn } from "@/lib/utils";
import { CATEGORIES, GEO_ZONES, BUDGET_LABELS } from "@/lib/constants";
import { useFilters } from "@/hooks/useFilters";
import CategoryIcon from "@/components/ui/CategoryIcon";

interface BottomSheetFiltersProps {
  totalResults: number;
}

export default function BottomSheetFilters({ totalResults }: BottomSheetFiltersProps) {
  const { filters, setFilter, resetFilters, toggleCategory } = useFilters();
  const [isOpen, setIsOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const hasActiveFilters =
    filters.categories.length > 0 || filters.zone || filters.budgetMax || filters.search;
  const activeCount =
    filters.categories.length + (filters.zone ? 1 : 0) + (filters.budgetMax ? 1 : 0);

  // Close on backdrop click
  const handleBackdropClick = useCallback(() => setIsOpen(false), []);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Trigger button — mobile only */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-moselle-cream-dark text-sm font-semibold text-moselle-text active:scale-95 transition-transform"
      >
        <SlidersHorizontal size={16} />
        Filtrer
        {activeCount > 0 && (
          <span className="w-5 h-5 bg-moselle-green text-white rounded-full text-xs flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Bottom Sheet — mobile only */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/40 z-50"
              onClick={handleBackdropClick}
            />

            {/* Sheet */}
            <motion.div
              ref={sheetRef}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              drag="y"
              dragControls={dragControls}
              dragConstraints={{ top: 0 }}
              dragElastic={0.1}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) setIsOpen(false);
              }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-auto"
              style={{ touchAction: "none" }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
                <div className="w-10 h-1 rounded-full bg-moselle-cream-dark" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-4 border-b border-moselle-cream-dark/50">
                <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-moselle-text">
                  Filtrer
                </h2>
                <div className="flex items-center gap-3">
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="text-sm text-moselle-red font-medium"
                    >
                      Effacer
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-moselle-cream"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-6 pb-safe">
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-semibold text-moselle-text-light mb-3">
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
                            "flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-sm font-medium transition-all",
                            isActive
                              ? "bg-moselle-green text-white shadow-sm"
                              : "bg-moselle-cream text-moselle-text-light"
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

                {/* Zone */}
                <div>
                  <h3 className="text-sm font-semibold text-moselle-text-light mb-3">
                    Zone géographique
                  </h3>
                  <div className="relative">
                    <select
                      value={filters.zone}
                      onChange={(e) => setFilter("zone", e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-moselle-cream-dark bg-moselle-white text-moselle-text text-sm focus:outline-none focus:border-moselle-green transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Toute la Moselle</option>
                      {GEO_ZONES.map((z) => (
                        <option key={z.value} value={z.value}>
                          {z.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-moselle-text-light pointer-events-none" />
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <h3 className="text-sm font-semibold text-moselle-text-light mb-3">
                    Budget maximum
                  </h3>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((level) => (
                      <button
                        key={level}
                        onClick={() =>
                          setFilter("budgetMax", filters.budgetMax === level ? 0 : level)
                        }
                        className={cn(
                          "flex-1 py-3 rounded-2xl text-sm font-semibold transition-all",
                          filters.budgetMax === level
                            ? "bg-moselle-brown text-white shadow-sm"
                            : "bg-moselle-cream text-moselle-text-light"
                        )}
                      >
                        {BUDGET_LABELS[level]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h3 className="text-sm font-semibold text-moselle-text-light mb-3">
                    Trier par
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "score", label: "Tasty Score" },
                      { value: "name", label: "Nom" },
                      { value: "budget", label: "Budget" },
                      { value: "recent", label: "Plus récent" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setFilter("sortBy", opt.value)}
                        className={cn(
                          "py-2.5 rounded-2xl text-sm font-medium transition-all",
                          filters.sortBy === opt.value
                            ? "bg-moselle-green text-white"
                            : "bg-moselle-cream text-moselle-text-light"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Apply button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3.5 bg-moselle-green text-white rounded-2xl font-semibold text-base active:scale-[0.98] transition-transform"
                >
                  Voir {totalResults} résultat{totalResults !== 1 ? "s" : ""}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
