import type { Metadata } from "next";
import { getAllAdresses } from "@/lib/api";
import WishlistContent from "@/components/wishlist/WishlistContent";

export const metadata: Metadata = {
  title: "Mes Envies | Taste of Moselle",
  description: "Vos adresses gourmandes favorites en Moselle.",
};

export default async function WishlistPage() {
  const allAdresses = await getAllAdresses();

  return (
    <>
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
        <WishlistContent allAdresses={allAdresses} />
      </section>
    </>
  );
}
