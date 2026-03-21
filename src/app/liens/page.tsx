import type { Metadata } from "next";
import Image from "next/image";
import { Instagram, Facebook, Globe, Mail, MapPin, FileText, Heart, Lightbulb } from "lucide-react";

export const metadata: Metadata = {
  title: "Nos liens",
  description: "Retrouvez tous les liens utiles de Taste of Moselle : Instagram, Facebook, blog, carte interactive.",
};

const links = [
  {
    icon: Instagram,
    label: "Instagram",
    description: "@tasteofmoselle",
    href: "https://instagram.com/tasteofmoselle",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    icon: Facebook,
    label: "Facebook",
    description: "Taste of Moselle",
    href: "https://facebook.com/tasteofmoselle",
    color: "bg-blue-600",
  },
  {
    icon: MapPin,
    label: "La Tasty Map",
    description: "Toutes nos adresses sur la carte",
    href: "/carte",
    color: "bg-moselle-green",
  },
  {
    icon: Globe,
    label: "Toutes les adresses",
    description: "Nos restos testés et approuvés",
    href: "/adresses",
    color: "bg-moselle-brown",
  },
  {
    icon: FileText,
    label: "Le Blog",
    description: "Articles, dossiers et rencontres",
    href: "/blog",
    color: "bg-moselle-blue",
  },
  {
    icon: Heart,
    label: "Mes envies",
    description: "Vos adresses sauvegardées",
    href: "/wishlist",
    color: "bg-moselle-red",
  },
  {
    icon: Lightbulb,
    label: "Suggérer une adresse",
    description: "Partagez vos pépites",
    href: "/suggerer",
    color: "bg-amber-500",
  },
  {
    icon: Mail,
    label: "Contact",
    description: "Une question ? Écrivez-nous",
    href: "/contact",
    color: "bg-gray-700",
  },
];

export default function LiensPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-moselle-green via-moselle-green to-moselle-green-light py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Profile */}
        <div className="text-center mb-8">
          <Image
            src="/images/LOGO.jpg"
            alt="Taste of Moselle"
            width={96}
            height={96}
            className="mx-auto rounded-3xl shadow-xl mb-4"
          />
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-white">
            <span className="italic">Taste of</span> Moselle
          </h1>
          <p className="font-[family-name:var(--font-accent)] text-lg text-white/70 mt-1">
            Le guide gourmand de la Moselle
          </p>
        </div>

        {/* Links */}
        <div className="space-y-3">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all active:scale-[0.98] group"
            >
              <div className={`w-11 h-11 rounded-xl ${link.color} flex items-center justify-center shrink-0`}>
                <link.icon size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{link.label}</p>
                <p className="text-white/60 text-xs truncate">{link.description}</p>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                className="text-white/40 group-hover:text-white/70 transition-colors shrink-0"
              >
                <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-white/40 text-xs mt-8">
          © {new Date().getFullYear()} Taste of Moselle
        </p>
      </div>
    </div>
  );
}
