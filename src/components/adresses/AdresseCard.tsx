"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin } from "lucide-react";
import type { Adresse } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import { cn, truncate } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Badge, { BudgetBadge } from "@/components/ui/Badge";
import TastyScore from "@/components/ui/TastyScore";
import CategoryIcon from "@/components/ui/CategoryIcon";
import CompareButton from "./CompareButton";
import { useWishlist } from "@/hooks/useWishlist";

interface AdresseCardProps {
  adresse: Adresse;
  distance?: number | null;
  className?: string;
}

const categoryBorderMap: Record<string, "green" | "brown" | "blue" | "red"> = {
  winstub: "brown",
  gastronomique: "red",
  "street-food": "green",
  brasserie: "brown",
  "salon-de-the": "blue",
  traiteur: "brown",
  "producteur-local": "green",
  "vins-caves": "red",
};

export default function AdresseCard({ adresse, distance, className }: AdresseCardProps) {
  const { toggle, isInWishlist } = useWishlist();
  const isSaved = isInWishlist(adresse.slug);
  const categoryLabel =
    CATEGORIES.find((c) => c.value === adresse.category)?.label ?? adresse.category;

  return (
    <Card
      borderColor={categoryBorderMap[adresse.category] ?? "green"}
      className={cn("group", className)}
    >
      {/* Cover image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={adresse.coverImage.url}
          alt={adresse.coverImage.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07] vintage-img"
        />
        {/* Top-right buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <CompareButton slug={adresse.slug} />
          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(adresse.slug);
            }}
            className={cn(
              "w-8 h-8 flex items-center justify-center",
              "rounded-full bg-white/90 backdrop-blur-sm shadow-md",
              "transition-all duration-200 hover:scale-110",
              isSaved ? "text-moselle-red" : "text-moselle-text-light hover:text-moselle-red"
            )}
            aria-label={isSaved ? "Retirer de mes envies" : "Ajouter à mes envies"}
          >
            <Heart size={16} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>
        {/* Score overlay */}
        <div className="absolute bottom-3 left-3 z-10">
          <TastyScore score={adresse.tastyScore} size="sm" />
        </div>
        {/* Distance badge */}
        {distance != null && (
          <div className="absolute bottom-3 right-3 z-10 bg-white/90 backdrop-blur-sm text-moselle-text text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            <MapPin size={12} className="text-moselle-green" />
            {distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`}
          </div>
        )}
      </div>

      {/* Content */}
      <Link href={`/adresses/${adresse.slug}`} className="block p-4">
        {/* Category + Budget */}
        <div className="flex items-center justify-between mb-2">
          <Badge variant={categoryBorderMap[adresse.category] === "red" ? "red" : "green"}>
            <CategoryIcon category={adresse.category} size={14} />
            {categoryLabel}
          </Badge>
          <BudgetBadge level={adresse.budget} />
        </div>

        {/* Name */}
        <h3 className="font-[family-name:var(--font-heading)] font-extrabold text-lg text-moselle-text mb-1 group-hover:text-moselle-green transition-colors duration-300 tracking-tight leading-snug">
          {adresse.name}
        </h3>

        {/* Petit Plus */}
        <p className="font-[family-name:var(--font-accent)] text-lg text-moselle-text-light leading-snug">
          {truncate(adresse.petitPlus, 80)}
        </p>
      </Link>
    </Card>
  );
}
