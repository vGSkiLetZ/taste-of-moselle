import type { Metadata } from "next";
import Image from "next/image";
import { Star, MapPin, Heart, ShieldCheck, Utensils, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez l'histoire de Taste of Moselle et des Tasty, deux amoureux du terroir mosellan qui partagent leurs meilleures adresses.",
};

export default function AProposPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-cream py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="font-[family-name:var(--font-accent)] text-2xl text-moselle-green mb-2">
            Qui sommes-nous ?
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-extrabold text-moselle-text tracking-tight mb-4">
            <span className="italic">Notre</span> Histoire
          </h1>
          <p className="font-[family-name:var(--font-body)] text-lg text-moselle-text-light max-w-2xl mx-auto italic">
            Le guide Michelin de la bienveillance en Moselle.
          </p>
          <div className="ornament-divider mt-6">
            <span className="text-moselle-brown/40">❦</span>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
          <div className="relative aspect-[4/3] rounded-[var(--radius-card)] overflow-hidden shadow-lg stamp-border">
            <Image
              src="/images/A PROPOS.jpg"
              alt="Les Tasty — couple fondateur de Taste of Moselle"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover vintage-img"
            />
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-moselle-text mb-4 section-heading tracking-tight">
              <span className="italic">Les</span> Tasty
            </h2>
            <div className="space-y-4 font-[family-name:var(--font-body)] text-moselle-text leading-relaxed">
              <p>
                Nous sommes un couple mosellan, gourmand, curieux, et un peu obsessionnel
                quand il s&apos;agit de trouver{" "}
                <em className="font-[family-name:var(--font-heading)] not-italic font-bold text-moselle-green">LA</em>{" "}
                bonne adresse.
              </p>
              <p>
                Taste of Moselle est né d&apos;une frustration simple : on ne trouvait pas
                de guide vraiment fiable pour manger (bien) en Moselle. Les avis Google sont
                parfois douteux, les guides traditionnels oublient souvent notre département.
              </p>
              <p className="italic text-moselle-text-light">
                Alors on a décidé de créer le nôtre. Pas un annuaire froid, mais un carnet
                d&apos;aventures. Chaque adresse est testée personnellement. Chaque note est
                le fruit d&apos;une visite réelle.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-moselle-text mb-8 text-center tracking-tight">
            <span className="italic">Nos</span> Valeurs
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Indépendance",
                desc: "Aucun placement payant. Si c'est ici, c'est qu'on l'a aimé. Point.",
              },
              {
                icon: Utensils,
                title: "Sincérité",
                desc: "Chaque adresse est testée en personne. Chaque avis est honnête et détaillé.",
              },
              {
                icon: Users,
                title: "Proximité",
                desc: "On croit aux artisans, producteurs et chefs passionnés de notre région.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="paper-texture bg-moselle-cream rounded-[var(--radius-card)] p-6 text-center"
              >
                <div className="relative z-2">
                  <div className="w-14 h-14 mx-auto mb-4 bg-moselle-green/10 rounded-full flex items-center justify-center">
                    <item.icon size={28} className="text-moselle-green" />
                  </div>
                  <h3 className="font-[family-name:var(--font-heading)] font-bold text-lg text-moselle-text mb-2">
                    {item.title}
                  </h3>
                  <p className="font-[family-name:var(--font-body)] text-sm text-moselle-text-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasty Score */}
        <div className="paper-texture bg-moselle-cream rounded-[var(--radius-card)] p-6 sm:p-8 mb-16">
          <div className="relative z-2">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-moselle-text mb-2 text-center tracking-tight">
              <span className="italic">Le</span> Tasty Score
            </h2>
            <p className="font-[family-name:var(--font-accent)] text-xl text-moselle-green text-center mb-8">
              Notre système de notation unique
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Users,
                  name: "Accueil",
                  desc: "La chaleur humaine, le sourire, l'attention portée aux clients.",
                },
                {
                  icon: Star,
                  name: "Assiette",
                  desc: "La qualité des produits, la maîtrise technique, le goût.",
                },
                {
                  icon: MapPin,
                  name: "Cadre",
                  desc: "L'ambiance, la décoration, le confort, la propreté.",
                },
                {
                  icon: Heart,
                  name: "Rapport Q/P",
                  desc: "Ce que vous obtenez pour ce que vous payez. La valeur ressentie.",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-start gap-4 p-4 bg-moselle-white/60 rounded-xl"
                >
                  <div className="w-10 h-10 shrink-0 bg-moselle-green/10 rounded-full flex items-center justify-center">
                    <item.icon size={20} className="text-moselle-green" />
                  </div>
                  <div>
                    <span className="font-[family-name:var(--font-heading)] font-bold text-moselle-text block mb-0.5">
                      {item.name}
                    </span>
                    <span className="text-sm text-moselle-text-light">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="font-[family-name:var(--font-body)] text-moselle-text leading-relaxed max-w-2xl mx-auto mb-2">
            On croit que la Moselle regorge de pépites méconnues. Des chefs passionnés,
            des producteurs engagés, des vignerons qui font revivre un terroir oublié.
          </p>
          <p className="font-[family-name:var(--font-accent)] text-2xl text-moselle-green">
            Notre mission : les mettre en lumière.
          </p>
        </div>
      </section>
    </>
  );
}
