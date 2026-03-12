"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Retour en haut"
      className={cn(
        "fixed z-40 bottom-20 md:bottom-8 right-4",
        "w-11 h-11 rounded-full",
        "bg-moselle-green text-moselle-white shadow-lg",
        "flex items-center justify-center",
        "hover:bg-moselle-green-light hover:shadow-xl",
        "active:scale-95",
        "transition-all duration-300 ease-out",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <ArrowUp size={20} strokeWidth={2.5} />
    </button>
  );
}
