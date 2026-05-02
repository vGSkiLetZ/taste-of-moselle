"use client";

import { useCallback } from "react";
import { useLocalStorageSlugs } from "./useLocalStorageSlugs";

const STORAGE_KEY = "tasty-visited";

export function useVisited() {
  const { slugs, count, isReady, add, remove, toggle, has } =
    useLocalStorageSlugs(STORAGE_KEY);

  const getBadge = useCallback(() => {
    if (count >= 20) return { label: "Gourmet Moselle", emoji: "👨‍🍳", color: "text-yellow-600" };
    if (count >= 10) return { label: "Explorateur", emoji: "🧭", color: "text-moselle-green" };
    if (count >= 5) return { label: "Curieux", emoji: "🍽️", color: "text-moselle-blue" };
    if (count >= 1) return { label: "Débutant", emoji: "🌱", color: "text-moselle-brown" };
    return null;
  }, [count]);

  return {
    slugs,
    count,
    isReady,
    markVisited: add,
    unmarkVisited: remove,
    toggle,
    isVisited: has,
    getBadge,
  };
}
