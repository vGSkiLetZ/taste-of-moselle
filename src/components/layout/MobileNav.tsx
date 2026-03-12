"use client";

import Link from "next/link";
import { X, Home, Utensils, MapPin, BookOpen, Users, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const links = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/adresses", label: "Adresses", icon: Utensils },
  { href: "/carte", label: "Carte", icon: MapPin },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/a-propos", label: "À propos", icon: Users },
  { href: "/wishlist", label: "Mes envies", icon: Heart },
];

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-72 bg-moselle-white z-50 shadow-xl safe-bottom"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-moselle-cream-dark">
              <span className="font-[family-name:var(--font-heading)] font-bold text-moselle-green text-lg">
                Menu
              </span>
              <button
                onClick={onClose}
                className="touch-target flex items-center justify-center text-moselle-text-light"
                aria-label="Fermer le menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Links */}
            <div className="py-4">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center gap-4 px-6 py-4 text-moselle-text hover:bg-moselle-cream transition-colors touch-target"
                  >
                    <link.icon size={22} className="text-moselle-green shrink-0" />
                    <span className="font-[family-name:var(--font-heading)] font-medium text-base">
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Footer tagline */}
            <div className="absolute bottom-6 left-0 right-0 px-6 text-center">
              <p className="font-[family-name:var(--font-accent)] text-lg text-moselle-text-light">
                Le guide gourmand de la Moselle
              </p>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
