import type { Metadata } from "next";
import { Instagram, Facebook, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Réseaux sociaux",
  description: "Suivez Taste of Moselle sur Instagram et Facebook pour nos dernières découvertes gourmandes.",
};

export default function SocialPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-moselle-text">
          Suivez-nous
        </h1>
        <p className="font-[family-name:var(--font-accent)] text-xl text-moselle-text-light mt-1">
          Nos aventures au quotidien
        </p>
      </div>

      <div className="grid gap-6">
        {/* Instagram */}
        <div className="paper-texture bg-moselle-cream rounded-[var(--radius-card)] p-6">
          <div className="relative z-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Instagram size={24} className="text-white" />
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-heading)] font-bold text-lg text-moselle-text">
                  Instagram
                </h2>
                <p className="text-sm text-moselle-text-light">@tasteofmoselle</p>
              </div>
            </div>
            <p className="text-moselle-text mb-4">
              Nos Reels, nos stories en direct des restaurants, et nos photos
              d&apos;assiettes qui font saliver.
            </p>
            <a
              href="https://instagram.com/tasteofmoselle"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-moselle-green text-white rounded-full text-sm font-semibold hover:bg-moselle-green-light transition-colors"
            >
              Suivre sur Instagram
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Facebook */}
        <div className="paper-texture bg-moselle-cream rounded-[var(--radius-card)] p-6">
          <div className="relative z-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Facebook size={24} className="text-white" />
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-heading)] font-bold text-lg text-moselle-text">
                  Facebook
                </h2>
                <p className="text-sm text-moselle-text-light">Taste of Moselle</p>
              </div>
            </div>
            <p className="text-moselle-text mb-4">
              Nos articles, nos recommandations, et les discussions avec la
              communauté gourmande mosellane.
            </p>
            <a
              href="https://facebook.com/tasteofmoselle"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-moselle-green text-white rounded-full text-sm font-semibold hover:bg-moselle-green-light transition-colors"
            >
              Suivre sur Facebook
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
