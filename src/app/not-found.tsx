import Link from "next/link";
import { MapPin, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <section className="section-cream min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Big 404 */}
        <p className="font-[family-name:var(--font-heading)] text-[8rem] sm:text-[10rem] font-extrabold leading-none text-moselle-green/15 tracking-tighter select-none">
          404
        </p>

        <div className="-mt-10 relative z-10">
          <p className="font-[family-name:var(--font-accent)] text-3xl text-moselle-green mb-3">
            Oups, on s&apos;est perdus...
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-extrabold text-moselle-text tracking-tight mb-4">
            Page introuvable
          </h1>
          <p className="font-[family-name:var(--font-body)] italic text-moselle-text-light leading-relaxed mb-8">
            Cette page n&apos;existe pas ou a été déplacée.
            Pas de panique, la Moselle regorge d&apos;autres belles découvertes !
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-moselle-green text-white rounded-full font-[family-name:var(--font-heading)] font-semibold text-sm uppercase tracking-wider hover:bg-moselle-green-light transition-colors btn-press"
            >
              <Home size={16} />
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/adresses"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-moselle-green text-moselle-green rounded-full font-[family-name:var(--font-heading)] font-semibold text-sm uppercase tracking-wider hover:bg-moselle-green hover:text-white transition-colors btn-press"
            >
              <Search size={16} />
              Explorer les adresses
            </Link>
          </div>
        </div>

        <div className="ornament-divider mt-10">
          <span className="text-moselle-brown/30">❦</span>
        </div>
      </div>
    </section>
  );
}
