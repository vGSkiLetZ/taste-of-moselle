"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";

interface WishlistButtonProps {
  slug: string;
  className?: string;
}

export default function WishlistButton({ slug, className }: WishlistButtonProps) {
  const { toggle, isInWishlist } = useWishlist();
  const isSaved = isInWishlist(slug);

  return (
    <button
      onClick={() => toggle(slug)}
      className={cn(
        "w-10 h-10 flex items-center justify-center",
        "rounded-full bg-white/90 backdrop-blur-sm shadow-md",
        "transition-all duration-200 touch-target",
        isSaved
          ? "text-moselle-red scale-110"
          : "text-moselle-text-light hover:text-moselle-red",
        className
      )}
      aria-label={isSaved ? "Retirer de mes envies" : "Ajouter à mes envies"}
    >
      <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
    </button>
  );
}
