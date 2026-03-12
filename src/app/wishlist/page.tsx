"use client";

import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";
import { useEffect, useState } from "react";
import type { Adresse } from "@/lib/types";
import AdresseCard from "@/components/adresses/AdresseCard";
import Button from "@/components/ui/Button";

export default function WishlistPage() {
  const { slugs, isReady } = useWishlist();
  const [adresses, setAdresses] = useState<Adresse[]>([]);

  useEffect(() => {
    if (isReady && slugs.length > 0) {
      import("@/data/adresses.json").then((mod) => {
        const all = mod.default as Adresse[];
        setAdresses(all.filter((a) => slugs.includes(a.slug)));
      });
    }
  }, [slugs, isReady]);

  if (!isReady) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse h-96 bg-moselle-cream rounded-xl" />
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="section-cream py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-[family-name:var(--font-accent)] text-2xl text-moselle-green mb-2">
            Votre sélection
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-extrabold text-moselle-text tracking-tight mb-4">
            <span className="italic">Mes</span> Envies
          </h1>
          <p className="font-[family-name:var(--font-body)] text-lg text-moselle-text-light max-w-2xl mx-auto italic">
            Les adresses qui vous font envie, sauvées pour plus tard.
          </p>
          <div className="ornament-divider mt-6">
            <span className="text-moselle-brown/40">❦</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        {slugs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-moselle-cream rounded-full flex items-center justify-center">
              <Heart size={36} className="text-moselle-text-light" />
            </div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-moselle-text mb-2">
              Votre liste est vide
            </h2>
            <p className="font-[family-name:var(--font-body)] italic text-moselle-text-light mb-6 max-w-md mx-auto">
              Explorez nos adresses et cliquez sur le cœur pour sauvegarder vos
              coups de cœur. Ils seront gardés ici !
            </p>
            <Link href="/adresses">
              <Button>
                Découvrir les adresses
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-moselle-text-light mb-6">
              {slugs.length} adresse{slugs.length > 1 ? "s" : ""} sauvée{slugs.length > 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {adresses.map((adresse) => (
                <AdresseCard key={adresse.id} adresse={adresse} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
