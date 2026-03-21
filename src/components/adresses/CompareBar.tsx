"use client";

import Link from "next/link";
import { Scale, X } from "lucide-react";
import { useCompare } from "@/hooks/useCompare";

export default function CompareBar() {
  const { slugs, count, clear } = useCompare();

  if (count < 2) return null;

  return (
    <div className="fixed bottom-16 md:bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3 bg-moselle-green text-white px-5 py-3 rounded-2xl shadow-xl">
        <Scale size={18} />
        <span className="text-sm font-medium">{count} adresses</span>
        <Link
          href={`/comparer?s=${slugs.join(",")}`}
          className="bg-white text-moselle-green px-4 py-1.5 rounded-xl text-sm font-bold hover:bg-moselle-cream transition-colors"
        >
          Comparer
        </Link>
        <button onClick={clear} className="text-white/60 hover:text-white transition-colors ml-1">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
