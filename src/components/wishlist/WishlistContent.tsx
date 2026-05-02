"use client";

import { Heart, ArrowRight, Share2, Check } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import type { Adresse } from "@/lib/types";
import AdresseCard from "@/components/adresses/AdresseCard";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface WishlistContentProps {
  allAdresses: Adresse[];
}

export default function WishlistContent({ allAdresses }: WishlistContentProps) {
  const { slugs, isReady } = useWishlist();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const adresses = useMemo(
    () => allAdresses.filter((a) => slugs.includes(a.slug)),
    [allAdresses, slugs]
  );

  const handleShare = useCallback(async () => {
    const shareUrl = `${window.location.origin}/wishlist/partage?s=${slugs.join(",")}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Ma sélection Taste of Moselle",
          text: `Découvre mes ${slugs.length} adresses favorites en Moselle !`,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled, fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast("link-copied", "Lien copié !");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copiez ce lien :", shareUrl);
    }
  }, [slugs, toast]);

  if (!isReady) {
    return <div className="animate-pulse h-96 bg-moselle-cream rounded-xl" />;
  }

  if (slugs.length === 0) {
    return (
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
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-moselle-text-light">
          {adresses.length} adresse{adresses.length > 1 ? "s" : ""} sauvée
          {adresses.length > 1 ? "s" : ""}
        </p>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-moselle-green text-white text-sm font-semibold hover:bg-moselle-green/90 transition-colors active:scale-95"
        >
          {copied ? <Check size={16} /> : <Share2 size={16} />}
          {copied ? "Copié !" : "Partager ma sélection"}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {adresses.map((adresse) => (
          <AdresseCard key={adresse.id} adresse={adresse} />
        ))}
      </div>
    </>
  );
}
