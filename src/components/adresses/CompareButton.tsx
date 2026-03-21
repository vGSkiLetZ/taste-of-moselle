"use client";

import { Scale } from "lucide-react";
import { useCompare } from "@/hooks/useCompare";

interface CompareButtonProps {
  slug: string;
  className?: string;
}

export default function CompareButton({ slug, className }: CompareButtonProps) {
  const { toggle, isComparing } = useCompare();
  const active = isComparing(slug);

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(slug); }}
      title={active ? "Retirer du comparateur" : "Ajouter au comparateur"}
      className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
        active
          ? "bg-moselle-green text-white shadow-md"
          : "bg-white/80 backdrop-blur-sm text-moselle-text-light hover:bg-moselle-green hover:text-white"
      } ${className || ""}`}
    >
      <Scale size={14} />
    </button>
  );
}
