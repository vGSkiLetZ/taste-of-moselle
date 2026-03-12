"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

const COOKIE_KEY = "tasty-cookies-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = (level: "essential" | "all") => {
    localStorage.setItem(COOKIE_KEY, level);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 safe-bottom"
        >
          <div className="max-w-lg mx-auto paper-texture bg-moselle-cream border-2 border-moselle-brown/30 rounded-[var(--radius-card)] p-5 shadow-xl">
            <div className="relative z-2">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Cookie size={22} className="text-moselle-brown" />
                  <h3 className="font-[family-name:var(--font-heading)] font-bold text-moselle-text">
                    Un cookie ?
                  </h3>
                </div>
                <button
                  onClick={() => accept("essential")}
                  className="text-moselle-text-light hover:text-moselle-text"
                  aria-label="Fermer"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-moselle-text-light mb-4">
                Pas ceux de mamie, malheureusement. On utilise des cookies pour
                améliorer votre expérience sur le site.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => accept("all")}
                >
                  Tout accepter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => accept("essential")}
                >
                  Essentiel uniquement
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
