"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Heart, Star, ChevronRight } from "lucide-react";

const screens = [
  {
    icon: MapPin,
    title: "Découvrez la Moselle",
    description: "Les meilleures adresses gourmandes testées et notées par deux passionnés du terroir mosellan.",
    color: "text-moselle-green",
    bg: "bg-moselle-green/10",
  },
  {
    icon: Star,
    title: "Le Tasty Score",
    description: "Chaque adresse reçoit une note sur 10 basée sur 4 critères : accueil, assiette, cadre et rapport qualité-prix.",
    color: "text-moselle-brown",
    bg: "bg-moselle-brown/10",
  },
  {
    icon: Heart,
    title: "Vos favoris",
    description: "Sauvegardez vos coups de cœur, marquez les restos testés et partagez votre sélection avec vos amis.",
    color: "text-moselle-red",
    bg: "bg-moselle-red/10",
  },
];

export default function Onboarding() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem("onboarding-done");
    if (!seen) setShow(true);
  }, []);

  const handleDone = () => {
    localStorage.setItem("onboarding-done", "1");
    setShow(false);
  };

  const handleNext = () => {
    if (step < screens.length - 1) setStep(step + 1);
    else handleDone();
  };

  if (!show) return null;

  const current = screens[step];
  const Icon = current.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] bg-moselle-cream flex flex-col items-center justify-center px-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center max-w-md"
          >
            <div className={`w-24 h-24 rounded-3xl ${current.bg} flex items-center justify-center mb-8`}>
              <Icon size={40} className={current.color} />
            </div>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-moselle-text mb-4">
              {current.title}
            </h2>
            <p className="font-[family-name:var(--font-body)] text-moselle-text-light text-lg leading-relaxed">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots + buttons */}
        <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center gap-6 px-8">
          {/* Progress dots */}
          <div className="flex gap-2">
            {screens.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? "w-8 bg-moselle-green" : "w-2 bg-moselle-cream-dark"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4 w-full max-w-xs">
            <button
              onClick={handleDone}
              className="text-sm text-moselle-text-light hover:text-moselle-text transition-colors"
            >
              Passer
            </button>
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 bg-moselle-green text-white py-3 rounded-full font-semibold text-base active:scale-95 transition-transform"
            >
              {step < screens.length - 1 ? "Suivant" : "C'est parti !"}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
