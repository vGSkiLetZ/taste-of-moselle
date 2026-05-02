"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SwipeNavigationProps {
  prevSlug: string | null;
  nextSlug: string | null;
  prevName: string | null;
  nextName: string | null;
}

export default function SwipeNavigation({
  prevSlug,
  nextSlug,
  prevName,
  nextName,
}: SwipeNavigationProps) {
  const router = useRouter();
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);
  const [swiping, setSwiping] = useState(false);
  const threshold = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setSwiping(true);
    setSwipeDir(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swiping) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    // Ignore vertical scrolls
    if (dy > Math.abs(dx)) {
      setSwiping(false);
      return;
    }
    if (dx > threshold && prevSlug) setSwipeDir("right");
    else if (dx < -threshold && nextSlug) setSwipeDir("left");
    else setSwipeDir(null);
  };

  const handleTouchEnd = () => {
    if (swipeDir === "right" && prevSlug) {
      router.push(`/adresses/${prevSlug}`);
    } else if (swipeDir === "left" && nextSlug) {
      router.push(`/adresses/${nextSlug}`);
    }
    setSwiping(false);
    setSwipeDir(null);
  };

  return (
    <>
      {/* Invisible swipe zone */}
      <div
        className="fixed inset-0 z-40 pointer-events-none"
        style={{ pointerEvents: swiping ? "auto" : "none" }}
      />
      <div
        className="fixed inset-0 z-30"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: "pan-y" }}
      />

      {/* Swipe indicators */}
      <AnimatePresence>
        {swiping && swipeDir === "right" && prevName && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-moselle-green text-white px-4 py-3 rounded-r-2xl shadow-lg flex items-center gap-2 max-w-[200px]"
          >
            <ChevronLeft size={20} className="shrink-0" />
            <span className="text-sm font-medium truncate">{prevName}</span>
          </motion.div>
        )}
        {swiping && swipeDir === "left" && nextName && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-moselle-green text-white px-4 py-3 rounded-l-2xl shadow-lg flex items-center gap-2 max-w-[200px]"
          >
            <span className="text-sm font-medium truncate">{nextName}</span>
            <ChevronRight size={20} className="shrink-0" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop prev/next buttons */}
      <div className="hidden md:flex fixed bottom-24 left-0 right-0 z-40 justify-between px-4 pointer-events-none">
        {prevSlug ? (
          <button
            onClick={() => router.push(`/adresses/${prevSlug}`)}
            className="pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur-sm text-moselle-text px-4 py-2.5 rounded-full shadow-lg hover:bg-moselle-green hover:text-white transition-colors"
          >
            <ChevronLeft size={18} />
            <span className="text-sm font-medium max-w-[150px] truncate">{prevName}</span>
          </button>
        ) : (
          <div />
        )}
        {nextSlug ? (
          <button
            onClick={() => router.push(`/adresses/${nextSlug}`)}
            className="pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur-sm text-moselle-text px-4 py-2.5 rounded-full shadow-lg hover:bg-moselle-green hover:text-white transition-colors"
          >
            <span className="text-sm font-medium max-w-[150px] truncate">{nextName}</span>
            <ChevronRight size={18} />
          </button>
        ) : (
          <div />
        )}
      </div>
    </>
  );
}
