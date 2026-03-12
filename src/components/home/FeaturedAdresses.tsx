"use client";

import type { Adresse } from "@/lib/types";
import AdresseCard from "@/components/adresses/AdresseCard";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionDivider from "@/components/ui/SectionDivider";

interface FeaturedAdressesProps {
  adresses: Adresse[];
}

export default function FeaturedAdresses({ adresses }: FeaturedAdressesProps) {
  return (
    <section className="section-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionDivider />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-8 mt-6"
        >
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-extrabold text-moselle-text section-heading tracking-tight">
              <span className="italic">Nos</span> coups de c&oelig;ur
            </h2>
            <p className="font-[family-name:var(--font-accent)] text-2xl text-moselle-text-light mt-1">
              Les adresses qui nous font vibrer
            </p>
          </div>
          <Link
            href="/adresses"
            className="hidden sm:flex items-center gap-1.5 font-[family-name:var(--font-heading)] text-sm font-semibold italic text-moselle-green hover:text-moselle-green-light transition-colors group"
          >
            Toutes les adresses
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Mobile: horizontal scroll, Desktop: grid */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
          {adresses.map((adresse, i) => (
            <motion.div
              key={adresse.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="min-w-[280px] md:min-w-0 snap-start"
            >
              <AdresseCard adresse={adresse} />
            </motion.div>
          ))}
        </div>

        <Link
          href="/adresses"
          className="flex sm:hidden items-center justify-center gap-1.5 mt-6 text-sm font-semibold text-moselle-green"
        >
          Voir toutes les adresses
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
