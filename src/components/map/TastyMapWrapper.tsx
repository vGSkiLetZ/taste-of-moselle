"use client";

import dynamic from "next/dynamic";
import type { Adresse } from "@/lib/types";

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
  return <TastyMap adresses={adresses} className="h-full rounded-none" />;
}
