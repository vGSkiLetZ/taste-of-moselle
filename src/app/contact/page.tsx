import type { Metadata } from "next";
import { Mail, Instagram, Facebook, MapPin } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Taste of Moselle. Suggérez une adresse, proposez une collaboration, ou dites-nous bonjour.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-cream py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="font-[family-name:var(--font-accent)] text-2xl text-moselle-green mb-2">
            On vous écoute
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-extrabold text-moselle-text tracking-tight mb-4">
            <span className="italic">Nous</span> Contacter
          </h1>
          <p className="font-[family-name:var(--font-body)] text-lg text-moselle-text-light max-w-2xl mx-auto italic">
            Une adresse à suggérer ? Une question ? On adore avoir de vos nouvelles.
          </p>
          <div className="ornament-divider mt-6">
            <span className="text-moselle-brown/40">❦</span>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-5 gap-10">
          {/* Form */}
          <div className="md:col-span-3">
            <ContactForm />
          </div>

          {/* Sidebar */}
          <div className="md:col-span-2">
            <div className="paper-texture bg-moselle-cream rounded-[var(--radius-card)] p-6 sticky top-20">
              <div className="relative z-2 space-y-6">
                <div>
                  <h3 className="font-[family-name:var(--font-heading)] font-bold text-lg text-moselle-text mb-3 section-heading">
                    Retrouvez-nous
                  </h3>
                  <div className="space-y-3">
                    <a
                      href="mailto:contact@tasteofmoselle.fr"
                      className="flex items-center gap-3 text-sm text-moselle-text hover:text-moselle-green transition-colors"
                    >
                      <Mail size={18} className="text-moselle-green shrink-0" />
                      contact@tasteofmoselle.fr
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-moselle-text hover:text-pink-500 transition-colors"
                    >
                      <Instagram size={18} className="text-pink-500 shrink-0" />
                      @tasteofmoselle
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-moselle-text hover:text-blue-600 transition-colors"
                    >
                      <Facebook size={18} className="text-blue-600 shrink-0" />
                      Taste of Moselle
                    </a>
                    <div className="flex items-start gap-3 text-sm text-moselle-text-light">
                      <MapPin size={18} className="text-moselle-green shrink-0 mt-0.5" />
                      Metz, Moselle, France
                    </div>
                  </div>
                </div>
                <div className="ornament-divider">
                  <span className="text-moselle-brown/30 text-sm">❦</span>
                </div>
                <p className="font-[family-name:var(--font-body)] italic text-sm text-moselle-text-light leading-relaxed">
                  On répond généralement sous 48h. Pour les suggestions d&apos;adresses,
                  on ira tester dès que possible !
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
