"use client";

import { useLocalStorageSlugs } from "./useLocalStorageSlugs";

const STORAGE_KEY = "tom-compare";
const MAX_ITEMS = 3;

export function useCompare() {
  const { slugs, count, isReady, toggle, remove, clear, has } =
    useLocalStorageSlugs(STORAGE_KEY, { max: MAX_ITEMS });

  return { slugs, count, isReady, toggle, remove, clear, isComparing: has };
}
