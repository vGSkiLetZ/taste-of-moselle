"use client";

import { useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
}

export default function PullToRefresh({ children, onRefresh, className }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const THRESHOLD = 80;
  const MAX_PULL = 120;

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0 && !refreshing) {
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    }
  }, [refreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!pulling.current) return;
    const deltaY = e.touches[0].clientY - startY.current;
    if (deltaY > 0) {
      // Apply resistance
      const distance = Math.min(deltaY * 0.5, MAX_PULL);
      setPullDistance(distance);
    } else {
      pulling.current = false;
      setPullDistance(0);
    }
  }, []);

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current) return;
    pulling.current = false;

    if (pullDistance >= THRESHOLD) {
      setRefreshing(true);
      setPullDistance(THRESHOLD * 0.6);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, onRefresh]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleTouchEnd);
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const progress = Math.min(pullDistance / THRESHOLD, 1);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Pull indicator */}
      <div
        className="flex items-center justify-center overflow-hidden transition-[height] duration-200"
        style={{ height: pullDistance > 0 ? `${pullDistance}px` : "0px" }}
      >
        <div
          className={cn(
            "w-9 h-9 rounded-full bg-moselle-cream flex items-center justify-center shadow-sm border border-moselle-cream-dark/50",
            refreshing && "animate-[spin_0.8s_linear_infinite]"
          )}
          style={{
            opacity: progress,
            transform: `rotate(${progress * 360}deg)`,
          }}
        >
          <RefreshCw size={18} className="text-moselle-green" />
        </div>
      </div>
      {children}
    </div>
  );
}
