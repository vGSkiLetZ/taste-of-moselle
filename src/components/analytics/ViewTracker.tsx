"use client";

import { useEffect, useRef } from "react";

interface ViewTrackerProps {
  pageType: "adresse" | "blog";
  pageSlug: string;
}

export default function ViewTracker({ pageType, pageSlug }: ViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageType, pageSlug }),
    }).catch(() => {
      // Silently fail — analytics should never break UX
    });
  }, [pageType, pageSlug]);

  return null;
}
