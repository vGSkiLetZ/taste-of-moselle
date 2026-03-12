"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Heart, Star, MapPin } from "lucide-react";
import Button from "@/components/ui/Button";

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    const duration = 1800;
    const steps = 40;
    const stepDuration = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += 1;
      const progress = current / steps;
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));

      if (current >= steps) {
        setCount(value);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export default function AboutSection() {
  return (
    <section className="section-cream py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/3] rounded-[var(--radius-card)] overflow-hidden shadow-lg stamp-border"
          >
            <Image
              src="/images/A PROPOS.jpg"
              alt="Les Tasty — couple fondateur de Taste of Moselle"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover vintage-img"
            />
          </motion.div>

          {/* Texte */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-[family-name:var(--font-accent)] text-2xl text-moselle-green mb-1">
              Qui sommes-nous ?
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl font-extrabold text-moselle-text mb-5 section-heading tracking-tight">
              <span className="italic">Les</span> Tasty
            </h2>
            <p className="font-[family-name:var(--font-body)] text-moselle-text leading-relaxed mb-4">
              Un couple mosellan, gourmand, curieux, et un peu obsessionnel quand
              il s&apos;agit de trouver <em className="font-[family-name:var(--font-heading)] not-italic font-bold text-moselle-green">LA</em> bonne adresse. Taste of Moselle, c&apos;est
              notre carnet d&apos;aventures gourmandes — pas un annuaire froid, mais
              un guide sinc&egrave;re du terroir mosellan.
            </p>
            <p className="font-[family-name:var(--font-body)] italic text-moselle-text-light leading-relaxed mb-6">
              Chaque adresse est test&eacute;e personnellement. Chaque note est le fruit
              d&apos;une visite r&eacute;elle. Aucun placement payant. Si c&apos;est ici,
              c&apos;est qu&apos;on l&apos;a aim&eacute;.
            </p>

            {/* Chiffres cl&eacute;s anim&eacute;s */}
            <div className="flex gap-6 mb-6">
              {[
                { icon: Star, label: "adresses test\u00e9es", value: 50, suffix: "+" },
                { icon: MapPin, label: "zones couvertes", value: 6, suffix: "" },
                { icon: Heart, label: "coups de c\u0153ur", value: 12, suffix: "" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <stat.icon size={20} className="mx-auto text-moselle-green mb-1" />
                  <p className="font-[family-name:var(--font-heading)] font-extrabold text-2xl text-moselle-text tracking-tight">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="font-[family-name:var(--font-accent)] text-sm text-moselle-text-light">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <Link href="/a-propos">
              <Button variant="outline" size="md">
                Notre histoire compl&egrave;te
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
