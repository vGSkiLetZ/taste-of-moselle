"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "tom-compare";
const MAX_ITEMS = 3;

export function useCompare() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setSlugs(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const persist = useCallback((next: string[]) => {
    setSlugs(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const toggle = useCallback((slug: string) => {
    setSlugs((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : prev.length < MAX_ITEMS
          ? [...prev, slug]
          : prev;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const remove = useCallback((slug: string) => {
    persist(slugs.filter((s) => s !== slug));
  }, [slugs, persist]);

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  const isComparing = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  return { slugs, count: slugs.length, toggle, remove, clear, isComparing };
}
