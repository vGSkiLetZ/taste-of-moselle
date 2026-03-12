"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { Category, GeoZone, BudgetLevel, Adresse } from "@/lib/types";

export interface FilterState {
  search: string;
  categories: Category[];
  zone: GeoZone | "";
  budgetMax: BudgetLevel | 0;
  sortBy: "score" | "name" | "budget" | "recent";
}

export function useFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters: FilterState = useMemo(() => ({
    search: searchParams.get("q") ?? "",
    categories: (searchParams.get("cat")?.split(",").filter(Boolean) ?? []) as Category[],
    zone: (searchParams.get("zone") ?? "") as GeoZone | "",
    budgetMax: (Number(searchParams.get("budget")) || 0) as BudgetLevel | 0,
    sortBy: (searchParams.get("sort") ?? "score") as FilterState["sortBy"],
  }), [searchParams]);

  const setFilter = useCallback(
    (key: keyof FilterState, value: string | string[] | number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (key === "search") {
        if (value) params.set("q", String(value));
        else params.delete("q");
      } else if (key === "categories") {
        const cats = value as string[];
        if (cats.length) params.set("cat", cats.join(","));
        else params.delete("cat");
      } else if (key === "zone") {
        if (value) params.set("zone", String(value));
        else params.delete("zone");
      } else if (key === "budgetMax") {
        if (value) params.set("budget", String(value));
        else params.delete("budget");
      } else if (key === "sortBy") {
        if (value && value !== "score") params.set("sort", String(value));
        else params.delete("sort");
      }

      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const resetFilters = useCallback(() => {
    router.replace("?", { scroll: false });
  }, [router]);

  const toggleCategory = useCallback(
    (cat: Category) => {
      const current = filters.categories;
      const next = current.includes(cat)
        ? current.filter((c) => c !== cat)
        : [...current, cat];
      setFilter("categories", next);
    },
    [filters.categories, setFilter]
  );

  return { filters, setFilter, resetFilters, toggleCategory };
}

export function applyFilters(adresses: Adresse[], filters: FilterState): Adresse[] {
  let result = [...adresses];

  // Text search
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.petitPlus.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)) ||
        a.address.toLowerCase().includes(q)
    );
  }

  // Category filter
  if (filters.categories.length > 0) {
    result = result.filter((a) => filters.categories.includes(a.category));
  }

  // Zone filter
  if (filters.zone) {
    result = result.filter((a) => a.geoZone === filters.zone);
  }

  // Budget filter
  if (filters.budgetMax) {
    result = result.filter((a) => a.budget <= filters.budgetMax);
  }

  // Sort
  switch (filters.sortBy) {
    case "score":
      result.sort((a, b) => b.tastyScore - a.tastyScore);
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name, "fr"));
      break;
    case "budget":
      result.sort((a, b) => a.budget - b.budget);
      break;
    case "recent":
      result.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
      break;
  }

  return result;
}
