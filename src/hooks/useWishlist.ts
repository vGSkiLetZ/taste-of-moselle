"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/Toast";

const STORAGE_KEY = "tasty-wishlist";

export function useWishlist() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();

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

  const add = useCallback(
    (slug: string) => {
      if (!slugs.includes(slug)) {
        persist([...slugs, slug]);
        toast("wishlist-add", "Ajouté à vos envies");
      }
    },
    [slugs, persist, toast]
  );

  const remove = useCallback(
    (slug: string) => {
      persist(slugs.filter((s) => s !== slug));
      toast("wishlist-remove", "Retiré de vos envies");
    },
    [slugs, persist, toast]
  );

  const toggle = useCallback(
    (slug: string) => {
      slugs.includes(slug) ? remove(slug) : add(slug);
    },
    [slugs, add, remove]
  );

  const isInWishlist = useCallback(
    (slug: string) => slugs.includes(slug),
    [slugs]
  );

  return { slugs, count: slugs.length, isReady, add, remove, toggle, isInWishlist };
}
