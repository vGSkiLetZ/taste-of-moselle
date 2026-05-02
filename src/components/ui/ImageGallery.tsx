"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { ImageAsset } from "@/lib/types";

interface ImageGalleryProps {
  images: ImageAsset[];
  className?: string;
}

export default function ImageGallery({ images, className }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  const open = useCallback((index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  }, []);

  const close = useCallback(() => setLightboxOpen(false), []);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, close, next, prev]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 50) {
      if (touchDeltaX.current > 0) prev();
      else next();
    }
  };

  if (images.length === 0) return null;

  return (
    <>
      {/* Thumbnail grid */}
      <div className={className}>
        <h2 className="font-[family-name:var(--font-heading)] font-semibold text-xl text-moselle-text mb-3 section-heading">
          Galerie photos
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => open(i)}
              className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 33vw, 150px"
                className="object-cover transition-transform duration-300 group-hover:scale-110 vintage-img"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center"
            onClick={close}
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute top-4 right-4 z-10 text-white/80 hover:text-white p-2"
            >
              <X size={28} />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-4 text-white/60 text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            {/* Main image */}
            <div
              className="relative w-full h-[70vh] mx-auto px-12"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={images[currentIndex].url}
                    alt={images[currentIndex].alt}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div
                className="flex gap-2 mt-4 px-4 overflow-x-auto max-w-full pb-2"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 ring-2 transition-all ${
                      i === currentIndex ? "ring-white" : "ring-transparent opacity-50 hover:opacity-80"
                    }`}
                  >
                    <Image src={img.url} alt={img.alt} fill sizes="56px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
