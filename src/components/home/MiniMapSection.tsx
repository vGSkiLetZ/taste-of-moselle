"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import type { Adresse } from "@/lib/types";
import AnimatedDivider from "@/components/ui/AnimatedDivider";

const TastyMap = dynamic(() => import("@/components/map/TastyMap"), { ssr: false });

interface MiniMapSectionProps {
  adresses: Adresse[];
}

export default function MiniMapSection({ adresses }: MiniMapSectionProps) {
  return (
    <section className="section-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <AnimatedDivider type="wave" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 mt-6"
        >
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-extrabold text-moselle-text section-heading tracking-tight">
            <span className="italic">La</span> Tasty Map
          </h2>
          <p className="font-[family-name:var(--font-accent)] text-2xl text-moselle-text-light mt-1">
            Toutes nos adresses sur la carte
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-moselle-cream-dark"
        >
          <div className="h-[350px] sm:h-[450px]">
            <TastyMap adresses={adresses} className="h-full rounded-none" />
          </div>
          {/* Overlay CTA */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 via-white/80 to-transparent p-6 pt-16 text-center">
            <Link
              href="/carte"
              className="inline-flex items-center gap-2 bg-moselle-green text-white px-6 py-3 rounded-full font-semibold hover:bg-moselle-green-light transition-colors shadow-lg btn-press"
            >
              <MapPin size={18} />
              Explorer la carte complète
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
