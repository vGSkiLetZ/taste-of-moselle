"use client";

import { useCallback, useEffect, useState } from "react";

interface Options {
  max?: number;
  onAdd?: (slug: string) => void;
  onRemove?: (slug: string) => void;
}

export function useLocalStorageSlugs(storageKey: string, options: Options = {}) {
  const { max, onAdd, onRemove } = options;
  const [slugs, setSlugs] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && !cancelled) {
          const cleaned = parsed.filter((s): s is string => typeof s === "string");
          // eslint-disable-next-line react-hooks/set-state-in-effect
          if (cleaned.length > 0) setSlugs(cleaned);
        }
      }
    } catch {
      // ignore — corrupt JSON is treated as empty
    }
    if (!cancelled) setIsReady(true);
    return () => {
      cancelled = true;
    };
  }, [storageKey]);

  const persist = useCallback(
    (updater: (prev: string[]) => string[]) => {
      setSlugs((prev) => {
        const next = updater(prev);
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [storageKey]
  );

  const add = useCallback(
    (slug: string) => {
      let added = false;
      persist((prev) => {
        if (prev.includes(slug)) return prev;
        if (max !== undefined && prev.length >= max) return prev;
        added = true;
        return [...prev, slug];
      });
      if (added) onAdd?.(slug);
    },
    [persist, max, onAdd]
  );

  const remove = useCallback(
    (slug: string) => {
      let removed = false;
      persist((prev) => {
        if (!prev.includes(slug)) return prev;
        removed = true;
        return prev.filter((s) => s !== slug);
      });
      if (removed) onRemove?.(slug);
    },
    [persist, onRemove]
  );

  const toggle = useCallback(
    (slug: string) => {
      let action: string = "noop";
      persist((prev) => {
        if (prev.includes(slug)) {
          action = "removed";
          return prev.filter((s) => s !== slug);
        }
        if (max !== undefined && prev.length >= max) return prev;
        action = "added";
        return [...prev, slug];
      });
      if (action === "added") onAdd?.(slug);
      else if (action === "removed") onRemove?.(slug);
    },
    [persist, max, onAdd, onRemove]
  );

  const clear = useCallback(() => {
    persist(() => []);
  }, [persist]);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  return { slugs, count: slugs.length, isReady, add, remove, toggle, clear, has };
}
