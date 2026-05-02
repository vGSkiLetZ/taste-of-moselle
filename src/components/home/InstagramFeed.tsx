"use client";

import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import AnimatedDivider from "@/components/ui/AnimatedDivider";

// Placeholder posts — these would be replaced with real Instagram embed or API
const placeholderPosts = [
  { id: 1, color: "from-moselle-green to-moselle-blue" },
  { id: 2, color: "from-moselle-brown to-moselle-red" },
  { id: 3, color: "from-moselle-blue to-moselle-green" },
  { id: 4, color: "from-moselle-red to-moselle-brown" },
  { id: 5, color: "from-moselle-green to-moselle-brown" },
  { id: 6, color: "from-moselle-brown to-moselle-blue" },
];

export default function InstagramFeed() {
  return (
    <section className="section-cream py-16 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <AnimatedDivider type="vine" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 mt-6"
        >
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-extrabold text-moselle-text section-heading tracking-tight">
            <span className="italic">Suivez</span>-nous
          </h2>
          <p className="font-[family-name:var(--font-accent)] text-2xl text-moselle-text-light mt-1">
            @tasteofmoselle sur Instagram
          </p>
        </motion.div>

        {/* Horizontal scroll feed */}
        <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2 snap-x snap-mandatory">
          {placeholderPosts.map((post, i) => (
            <motion.a
              key={post.id}
              href="https://instagram.com/tasteofmoselle"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group relative min-w-[200px] sm:min-w-[240px] aspect-square rounded-2xl overflow-hidden shadow-md snap-start shrink-0"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${post.color} opacity-20`} />
              <div className="absolute inset-0 bg-moselle-cream flex items-center justify-center">
                <div className="text-center">
                  <Instagram size={32} className="mx-auto text-moselle-text-light/40 mb-2" />
                  <p className="text-xs text-moselle-text-light/60 font-medium">Post Instagram</p>
                </div>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-moselle-green/0 group-hover:bg-moselle-green/20 transition-colors flex items-center justify-center">
                <Instagram size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
              </div>
            </motion.a>
          ))}
        </div>

        <div className="text-center mt-6">
          <a
            href="https://instagram.com/tasteofmoselle"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-moselle-text-light hover:text-pink-500 transition-colors"
          >
            <Instagram size={18} />
            Voir plus sur Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
