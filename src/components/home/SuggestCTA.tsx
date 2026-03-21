"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lightbulb, ArrowRight } from "lucide-react";

export default function SuggestCTA() {
  return (
    <section className="py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-moselle-green via-moselle-green to-moselle-green-light p-8 sm:p-12 text-white text-center">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-5 bg-white/20 rounded-2xl flex items-center justify-center"
            >
              <Lightbulb size={32} />
            </motion.div>

            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
              Vous connaissez une pépite ?
            </h2>
            <p className="font-[family-name:var(--font-body)] text-white/80 text-lg max-w-xl mx-auto mb-6 italic">
              Un restaurant, un producteur, un café... Partagez vos découvertes mosellanes et nous irons les tester !
            </p>
            <Link
              href="/suggerer"
              className="inline-flex items-center gap-2 bg-white text-moselle-green px-8 py-3.5 rounded-full font-semibold text-base hover:bg-moselle-cream transition-colors shadow-lg active:scale-95"
            >
              Suggérer une adresse
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
