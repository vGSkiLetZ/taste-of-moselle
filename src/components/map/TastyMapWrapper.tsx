"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Adresse } from "@/lib/types";
import { Maximize2, Minimize2 } from "lucide-react";

const TastyMap = dynamic(() => import("@/components/map/TastyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-moselle-cream animate-pulse" />
  ),
});

interface TastyMapWrapperProps {
  adresses: Adresse[];
}

export default function TastyMapWrapper({ adresses }: TastyMapWrapperProps) {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className={fullscreen ? "fixed inset-0 z-[9999] bg-moselle-white" : "h-full relative"}>
      <TastyMap adresses={adresses} className="h-full rounded-none" />

      {/* Fullscreen toggle button */}
      <button
        onClick={() => setFullscreen(!fullscreen)}
        className="absolute top-3 left-3 z-[1001] w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-moselle-cream transition-colors"
        title={fullscreen ? "Quitter le plein écran" : "Plein écran"}
      >
        {fullscreen ? (
          <Minimize2 size={18} className="text-moselle-text" />
        ) : (
          <Maximize2 size={18} className="text-moselle-text" />
        )}
      </button>
    </div>
  );
}
