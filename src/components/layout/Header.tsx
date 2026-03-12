"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Heart, MapPin, Instagram, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";
import MobileNav from "./MobileNav";

const navLinks = [
  { href: "/adresses", label: "Adresses" },
  { href: "/carte", label: "Carte", icon: MapPin },
  { href: "/blog", label: "Blog" },
  { href: "/a-propos", label: "\u00C0 propos" },
];

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500 ease-out",
          scrolled
            ? "bg-moselle-white/80 backdrop-blur-xl shadow-[0_1px_12px_rgba(61,46,31,0.08)] border-b border-moselle-cream-dark/60"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
          >
            <Image
              src="/images/LOGO.jpg"
              alt="Taste of Moselle"
              width={40}
              height={40}
              className={cn(
                "rounded-xl object-cover transition-all duration-500",
                scrolled ? "scale-100" : "scale-105"
              )}
            />
            <span className="font-[family-name:var(--font-heading)] text-xl font-extrabold text-moselle-text tracking-tight">
              <span className="italic">Taste of</span>{" "}
              <span className="text-moselle-green not-italic">Moselle</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-[family-name:var(--font-heading)] text-xs font-semibold uppercase tracking-widest text-moselle-text-light hover:text-moselle-green transition-colors flex items-center gap-1.5"
              >
                {link.icon && <link.icon size={16} />}
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 ml-2 border-l border-moselle-cream-dark pl-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-moselle-text-light hover:text-pink-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-moselle-text-light hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
            </div>
            <Link
              href="/wishlist"
              className="relative text-moselle-text-light hover:text-moselle-red transition-colors"
              aria-label={`Wishlist (${count} adresses)`}
            >
              <Heart size={20} />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-moselle-red text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {count}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile: Social + Wishlist + Hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-moselle-text-light hover:text-pink-500 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-moselle-text-light hover:text-blue-600 transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <Link
              href="/wishlist"
              className="relative text-moselle-text-light hover:text-moselle-red transition-colors touch-target flex items-center justify-center"
              aria-label={`Wishlist (${count} adresses)`}
            >
              <Heart size={22} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-moselle-red text-white text-xs w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold">
                  {count}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsNavOpen(true)}
              className="touch-target flex items-center justify-center text-moselle-text"
              aria-label="Ouvrir le menu"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
    </>
  );
}
