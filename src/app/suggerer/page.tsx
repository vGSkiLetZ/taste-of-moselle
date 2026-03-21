import type { Metadata } from "next";
import SuggestionForm from "@/components/forms/SuggestionForm";

export const metadata: Metadata = {
  title: "Suggérer une adresse",
  description: "Proposez-nous une adresse gourmande en Moselle ! Nous la testerons pour vous.",
};

export default function SuggererPage() {
  return (
    <>
      <section className="section-cream py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-[family-name:var(--font-accent)] text-2xl text-moselle-green mb-2">
            Une pépite à partager ?
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-extrabold text-moselle-text tracking-tight mb-4">
            <span className="italic">Suggérer</span> une adresse
          </h1>
          <p className="font-[family-name:var(--font-body)] text-lg text-moselle-text-light max-w-2xl mx-auto italic">
            Vous connaissez une adresse incontournable en Moselle ? Partagez-la avec nous, nous irons la tester !
          </p>
          <div className="ornament-divider mt-6">
            <span className="text-moselle-brown/40">❦</span>
          </div>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 py-8">
        <SuggestionForm />
      </section>
    </>
  );
}
