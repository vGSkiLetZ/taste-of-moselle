"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-moselle-green text-white pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/images/LOGO.jpg"
                alt="Taste of Moselle"
                width={48}
                height={48}
                className="rounded-xl border-2 border-white/30"
              />
              <h3 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold tracking-tight">
                <span className="italic">Taste of</span> Moselle
              </h3>
            </div>
            <p className="font-[family-name:var(--font-accent)] text-2xl text-moselle-green-pale">
              Le guide gourmand de la Moselle
            </p>
            <p className="mt-4 text-sm text-white/80 leading-relaxed font-[family-name:var(--font-body)] italic">
              Un carnet d&apos;aventures gourmandes partagées par deux amoureux du terroir mosellan.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-[family-name:var(--font-heading)] font-bold text-lg mb-4 uppercase tracking-widest text-white/90">
              Explorer
            </h4>
            <nav className="space-y-3">
              {[
                { href: "/adresses", label: "Les Adresses" },
                { href: "/carte", label: "La Carte" },
                { href: "/blog", label: "Le Blog" },
                { href: "/a-propos", label: "Notre Histoire" },
                { href: "/wishlist", label: "Mes Envies" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm font-[family-name:var(--font-heading)] text-white/80 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-[family-name:var(--font-heading)] font-bold text-lg mb-4 uppercase tracking-widest text-white/90">
              Suivez-nous
            </h4>
            <p className="text-sm text-white/80 mb-4">
              Retrouvez nos decouvertes gourmandes sur les reseaux.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={22} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={22} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p>
            © {new Date().getFullYear()} Taste of Moselle. Fait avec{" "}
            <Heart size={12} className="inline text-moselle-red" /> en Moselle.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">
              Mentions légales
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
