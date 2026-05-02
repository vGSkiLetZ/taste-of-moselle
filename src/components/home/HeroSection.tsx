"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { MapPin, Search } from "lucide-react";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-moselle-cream min-h-[85vh] md:min-h-[90vh] flex items-center">
      {/* Background video with parallax */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/images/hero/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 hero-gradient-animated" />
        {/* Bottom anchor: stronger fade so CTAs and search read crisply over busy footage */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/15 to-moselle-cream" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl md:text-8xl font-extrabold mb-4 leading-[0.95] tracking-tight [text-shadow:_0_3px_20px_rgba(0,0,0,0.6)]"
        >
          <span className="text-moselle-cream italic">Taste of</span>
          <br />
          <span className="text-moselle-green-light not-italic tracking-[-0.03em]">Moselle</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="font-[family-name:var(--font-accent)] text-3xl sm:text-4xl text-moselle-cream mb-3 drop-shadow-md"
        >
          Le guide gourmand de la Moselle
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-[family-name:var(--font-body)] italic text-base sm:text-lg text-white/90 max-w-xl mx-auto mb-8 drop-shadow-md"
        >
          Les meilleures adresses, testées et approuvées par deux amoureux du terroir mosellan.
        </motion.p>

        {/* Search bar — stacked on mobile, inline on desktop */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          onSubmit={(e) => {
            e.preventDefault();
            if (search.trim()) router.push(`/adresses?q=${encodeURIComponent(search.trim())}`);
            else router.push("/adresses");
          }}
          className="max-w-lg mx-auto mb-6 flex flex-col sm:flex-row gap-2 sm:gap-0 sm:relative"
        >
          <div className="relative flex-1">
            <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-moselle-text-light" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Restaurant, plat, ville…"
              className="w-full pl-12 pr-4 sm:pr-32 py-4 rounded-full bg-white/95 backdrop-blur-md text-moselle-text placeholder:text-moselle-text-light/60 shadow-xl focus:outline-none focus:ring-2 focus:ring-moselle-green text-base"
            />
          </div>
          <button
            type="submit"
            className="sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 bg-moselle-green text-white px-5 py-3 sm:py-2.5 rounded-full text-sm font-semibold hover:bg-moselle-green-light transition-colors shadow-lg sm:shadow-none"
          >
            Chercher
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/adresses">
            <Button size="lg">
              <Search size={20} />
              Toutes les adresses
            </Button>
          </Link>
          <Link href="/carte">
            <Button variant="outline" size="lg" className="border-white/80 text-white bg-white/15 backdrop-blur-sm hover:bg-moselle-green hover:text-white hover:border-moselle-green">
              <MapPin size={20} />
              Voir la carte
            </Button>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-white/60" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
