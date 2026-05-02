"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { Adresse } from "@/lib/types";
import TastyScore from "@/components/ui/TastyScore";
import { BudgetBadge } from "@/components/ui/Badge";
import { MapPin, Star } from "lucide-react";
import { CATEGORIES, GEO_ZONES } from "@/lib/constants";

interface HoverPreviewProps {
  adresse: Adresse;
  children: React.ReactNode;
}

export default function HoverPreview({ adresse, children }: HoverPreviewProps) {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const categoryLabel = CATEGORIES.find((c) => c.value === adresse.category)?.label ?? adresse.category;
  const zoneLabel = GEO_ZONES.find((z) => z.value === adresse.geoZone)?.label ?? adresse.geoZone;

  const handleEnter = () => {
    timeoutRef.current = setTimeout(() => setShow(true), 400);
  };

  const handleLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShow(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}

      {/* Desktop-only hover preview */}
      {show && (
        <div className="hidden md:block absolute z-50 top-0 left-full ml-3 w-72 bg-white rounded-2xl shadow-2xl border border-moselle-cream-dark overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="relative h-36">
            <Image
              src={adresse.coverImage.url}
              alt={adresse.coverImage.alt}
              fill
              className="object-cover vintage-img"
              sizes="288px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 left-3">
              <TastyScore score={adresse.tastyScore} size="sm" />
            </div>
            <div className="absolute bottom-2 right-3">
              <BudgetBadge level={adresse.budget} />
            </div>
          </div>
          <div className="p-3">
            <h4 className="font-[family-name:var(--font-heading)] font-bold text-sm text-moselle-text mb-1">
              {adresse.name}
            </h4>
            <div className="flex items-center gap-2 text-xs text-moselle-text-light mb-1.5">
              <span>{categoryLabel}</span>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                <MapPin size={10} />
                {zoneLabel}
              </span>
            </div>
            <p className="font-[family-name:var(--font-accent)] text-sm text-moselle-text-light leading-snug line-clamp-2">
              &ldquo;{adresse.petitPlus}&rdquo;
            </p>
            {adresse.tastyScore >= 9 && (
              <div className="flex items-center gap-1 mt-2 text-amber-600 text-xs font-semibold">
                <Star size={12} fill="currentColor" />
                Coup de coeur
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
