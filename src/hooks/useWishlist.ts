"use client";

import { useToast } from "@/components/ui/Toast";
import { useLocalStorageSlugs } from "./useLocalStorageSlugs";

const STORAGE_KEY = "tasty-wishlist";

export function useWishlist() {
  const { toast } = useToast();
  const { slugs, count, isReady, add, remove, toggle, has } =
    useLocalStorageSlugs(STORAGE_KEY, {
      onAdd: () => toast("wishlist-add", "Ajouté à vos envies"),
      onRemove: () => toast("wishlist-remove", "Retiré de vos envies"),
    });

  return {
    slugs,
    count,
    isReady,
    add,
    remove,
    toggle,
    isInWishlist: has,
  };
}
