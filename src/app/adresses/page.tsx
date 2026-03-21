import type { Metadata } from "next";
import { getAllAdresses } from "@/lib/api";
import AdresseGrid from "@/components/adresses/AdresseGrid";
import SurprendsButton from "@/components/ui/SurprendsButton";

export const metadata: Metadata = {
  title: "Les Adresses",
  description:
    "Découvrez toutes nos adresses gourmandes en Moselle : restaurants, winstubs, producteurs, caves à vins. Testées et approuvées par les Tasty.",
};

export default async function AdressesPage() {
  const adresses = await getAllAdresses();

  return (
    <>
      {/* Hero */}
      <section className="section-cream py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-[family-name:var(--font-accent)] text-2xl text-moselle-green mb-2">
            Nos découvertes
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-extrabold text-moselle-text tracking-tight mb-4">
            <span className="italic">Les</span> Adresses
          </h1>
          <p className="font-[family-name:var(--font-body)] text-lg text-moselle-text-light max-w-2xl mx-auto italic">
            Chaque adresse est testée, chaque note est sincère. Trouvez votre prochaine pépite mosellane.
          </p>
          <div className="ornament-divider mt-6">
            <span className="text-moselle-brown/40">❦</span>
          </div>
          <div className="mt-6">
            <SurprendsButton slugs={adresses.map((a) => a.slug)} />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <AdresseGrid adresses={adresses} />
      </section>
    </>
  );
}
