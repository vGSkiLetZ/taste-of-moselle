"use client";

import { CheckCircle, Circle } from "lucide-react";
import { useVisited } from "@/hooks/useVisited";
import { useToast } from "@/components/ui/Toast";

interface VisitedButtonProps {
  slug: string;
  variant?: "icon" | "full";
}

export default function VisitedButton({ slug, variant = "icon" }: VisitedButtonProps) {
  const { isVisited, toggle } = useVisited();
  const { toast } = useToast();
  const visited = isVisited(slug);

  const handleClick = () => {
    toggle(slug);
    toast(
      visited ? "success" : "success",
      visited ? "Retiré de vos visites" : "Marqué comme testé !"
    );
  };

  if (variant === "full") {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 ${
          visited
            ? "bg-moselle-green text-white"
            : "bg-moselle-cream text-moselle-text hover:bg-moselle-cream-dark"
        }`}
      >
        {visited ? <CheckCircle size={16} /> : <Circle size={16} />}
        {visited ? "Déjà testé ✓" : "Marquer comme testé"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-sm transition-all active:scale-90 ${
        visited
          ? "bg-moselle-green text-white"
          : "bg-black/30 text-white hover:bg-black/40"
      }`}
      aria-label={visited ? "Déjà testé" : "Marquer comme testé"}
    >
      {visited ? <CheckCircle size={20} /> : <Circle size={20} />}
    </button>
  );
}
