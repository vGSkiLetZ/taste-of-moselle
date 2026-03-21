"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "tasty-visited";

export function useVisited() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSlugs(JSON.parse(stored));
    } catch {
      // ignore
    }
    setIsReady(true);
  }, []);

  const persist = useCallback((next: string[]) => {
    setSlugs(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const markVisited = useCallback(
    (slug: string) => {
      if (!slugs.includes(slug)) {
        persist([...slugs, slug]);
      }
    },
    [slugs, persist]
  );

  const unmarkVisited = useCallback(
    (slug: string) => {
      persist(slugs.filter((s) => s !== slug));
    },
    [slugs, persist]
  );

  const toggle = useCallback(
    (slug: string) => {
      slugs.includes(slug) ? unmarkVisited(slug) : markVisited(slug);
    },
    [slugs, markVisited, unmarkVisited]
  );

  const isVisited = useCallback(
    (slug: string) => slugs.includes(slug),
    [slugs]
  );

  // Badge levels
  const getBadge = useCallback(() => {
    const count = slugs.length;
    if (count >= 20) return { label: "Gourmet Moselle", emoji: "👨‍🍳", color: "text-yellow-600" };
    if (count >= 10) return { label: "Explorateur", emoji: "🧭", color: "text-moselle-green" };
    if (count >= 5) return { label: "Curieux", emoji: "🍽️", color: "text-moselle-blue" };
    if (count >= 1) return { label: "Débutant", emoji: "🌱", color: "text-moselle-brown" };
    return null;
  }, [slugs]);

  return {
    slugs,
    count: slugs.length,
    isReady,
    markVisited,
    unmarkVisited,
    toggle,
    isVisited,
    getBadge,
  };
}
