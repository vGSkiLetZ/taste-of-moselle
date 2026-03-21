import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllAdresses } from "@/lib/api";
import SharedWishlistContent from "@/components/wishlist/SharedWishlistContent";

export const metadata: Metadata = {
  title: "Sélection partagée | Taste of Moselle",
  description: "Découvrez cette sélection d'adresses gourmandes en Moselle",
};

export default async function SharedWishlistPage() {
  const allAdresses = await getAllAdresses();

  return (
    <>
      <section className="section-cream py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-[family-name:var(--font-accent)] text-2xl text-moselle-green mb-2">
            Découvrez
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-extrabold text-moselle-text tracking-tight mb-4">
            <span className="italic">Une</span> Sélection
          </h1>
          <p className="font-[family-name:var(--font-body)] text-lg text-moselle-text-light max-w-2xl mx-auto italic">
            Quelqu&apos;un partage ses adresses favorites avec vous.
          </p>
          <div className="ornament-divider mt-6">
            <span className="text-moselle-brown/40">❦</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="animate-pulse h-96 bg-moselle-cream rounded-xl" />
          }
        >
          <SharedWishlistContent allAdresses={allAdresses} />
        </Suspense>
      </section>
    </>
  );
}
