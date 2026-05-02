"use client";

import { Shuffle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface SurprendsButtonProps {
  slugs: string[];
}

export default function SurprendsButton({ slugs }: SurprendsButtonProps) {
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);

  const handleClick = useCallback(() => {
    if (slugs.length === 0) return;
    setSpinning(true);
    const random = slugs[Math.floor(Math.random() * slugs.length)];
    setTimeout(() => {
      router.push(`/adresses/${random}`);
    }, 400);
  }, [slugs, router]);

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent border-2 border-moselle-brown/70 text-moselle-brown-dark rounded-full text-sm font-semibold hover:bg-moselle-brown hover:text-white hover:border-moselle-brown transition-colors active:scale-95"
    >
      <Shuffle size={16} className={spinning ? "animate-spin" : ""} />
      Surprends-moi !
    </button>
  );
}
