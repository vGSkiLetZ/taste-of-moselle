"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import type { Adresse } from "@/lib/types";
import AdresseCard from "@/components/adresses/AdresseCard";
import Button from "@/components/ui/Button";

interface SharedWishlistContentProps {
  allAdresses: Adresse[];
}

export default function SharedWishlistContent({ allAdresses }: SharedWishlistContentProps) {
  const searchParams = useSearchParams();

  const adresses = useMemo(() => {
    const slugsParam = searchParams.get("s");
    if (!slugsParam) return [];
    const slugs = slugsParam.split(",").filter(Boolean);
    return allAdresses.filter((a) => slugs.includes(a.slug));
  }, [searchParams, allAdresses]);

  if (adresses.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-6 bg-moselle-cream rounded-full flex items-center justify-center">
          <Heart size={36} className="text-moselle-text-light" />
        </div>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-moselle-text mb-2">
          Aucune adresse trouvée
        </h2>
        <p className="font-[family-name:var(--font-body)] italic text-moselle-text-light mb-6">
          Ce lien de partage semble invalide ou les adresses n&apos;existent plus.
        </p>
        <Link href="/adresses">
          <Button>
            Découvrir les adresses
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-moselle-text-light mb-6">
        {adresses.length} adresse{adresses.length > 1 ? "s" : ""} dans cette
        sélection
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {adresses.map((adresse) => (
          <AdresseCard key={adresse.id} adresse={adresse} />
        ))}
      </div>
    </>
  );
}
