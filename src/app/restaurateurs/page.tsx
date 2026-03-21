import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Star, Users, TrendingUp, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Pour les restaurateurs",
  description: "Vous êtes restaurateur en Moselle ? Découvrez comment être référencé sur Taste of Moselle.",
};

const benefits = [
  {
    icon: Star,
    title: "Test sincère & bienveillant",
    description: "Notre équipe vient tester votre établissement de manière anonyme. Nous publions un avis honnête et constructif.",
  },
  {
    icon: Users,
    title: "Visibilité locale",
    description: "Touchez une audience de gourmands mosellans actifs qui cherchent leur prochaine sortie.",
  },
  {
    icon: TrendingUp,
    title: "Référencement optimisé",
    description: "Votre fiche est optimisée SEO avec Schema.org, photos, score détaillé et lien vers votre site.",
  },
];

const steps = [
  { step: "1", title: "Contactez-nous", description: "Envoyez-nous un message via le formulaire ou nos réseaux." },
  { step: "2", title: "Nous venons tester", description: "Notre équipe vient de manière anonyme pour une expérience authentique." },
  { step: "3", title: "Publication de la fiche", description: "Votre fiche est publiée avec score, photos et avis détaillé." },
];

export default function RestaurateursPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-moselle-green via-moselle-green to-moselle-green-light text-white py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="font-[family-name:var(--font-accent)] text-2xl text-white/80 mb-3">
            Vous êtes restaurateur ?
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Faites découvrir votre<br />établissement
          </h1>
          <p className="font-[family-name:var(--font-body)] text-lg text-white/80 max-w-2xl mx-auto mb-8 italic">
            Taste of Moselle met en lumière les meilleures adresses du territoire. Rejoignez notre guide gourmand.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-moselle-green px-8 py-4 rounded-full font-semibold text-lg hover:bg-moselle-cream transition-colors shadow-xl"
          >
            <Mail size={20} />
            Nous contacter
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-cream py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-moselle-text text-center mb-12 section-heading">
            <span className="italic">Pourquoi</span> Taste of Moselle ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="paper-texture bg-moselle-cream rounded-[var(--radius-card)] p-6 text-center">
                <div className="relative z-2">
                  <div className="w-14 h-14 mx-auto mb-4 bg-moselle-green/10 rounded-2xl flex items-center justify-center">
                    <b.icon size={28} className="text-moselle-green" />
                  </div>
                  <h3 className="font-[family-name:var(--font-heading)] font-bold text-lg text-moselle-text mb-2">
                    {b.title}
                  </h3>
                  <p className="text-sm text-moselle-text-light leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-moselle-text text-center mb-12 section-heading">
            <span className="italic">Comment</span> ça marche ?
          </h2>
          <div className="space-y-8">
            {steps.map((s) => (
              <div key={s.step} className="flex items-start gap-5">
                <div className="w-12 h-12 shrink-0 bg-moselle-green text-white rounded-2xl flex items-center justify-center font-[family-name:var(--font-heading)] font-extrabold text-xl">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-heading)] font-bold text-lg text-moselle-text mb-1">
                    {s.title}
                  </h3>
                  <p className="text-moselle-text-light">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-moselle-text mb-4">
            Prêt à nous rejoindre ?
          </h2>
          <p className="text-moselle-text-light mb-8">
            Le référencement est gratuit. Contactez-nous pour en discuter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-moselle-green text-white px-8 py-3.5 rounded-full font-semibold hover:bg-moselle-green-light transition-colors"
            >
              <Mail size={18} />
              Nous écrire
            </Link>
            <Link
              href="/suggerer"
              className="inline-flex items-center justify-center gap-2 bg-moselle-cream text-moselle-text px-8 py-3.5 rounded-full font-semibold hover:bg-moselle-cream-dark transition-colors"
            >
              Suggérer votre adresse
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
