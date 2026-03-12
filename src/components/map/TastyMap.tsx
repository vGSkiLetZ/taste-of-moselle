"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import type { Adresse } from "@/lib/types";
import { MAP_CENTER, MAP_DEFAULT_ZOOM, CATEGORIES, BUDGET_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import TastyScore from "@/components/ui/TastyScore";
import CategoryIcon from "@/components/ui/CategoryIcon";

interface TastyMapProps {
  adresses: Adresse[];
  highlightSlug?: string;
  className?: string;
}

function createCategoryIcon(category: string) {
  const colors: Record<string, string> = {
    winstub: "#6B4E2F",
    gastronomique: "#C45B3E",
    "street-food": "#4A7C59",
    brasserie: "#6B4E2F",
    "salon-de-the": "#5B8FA8",
    traiteur: "#6B4E2F",
    "producteur-local": "#4A7C59",
    "vins-caves": "#C45B3E",
  };
  const color = colors[category] || "#4A7C59";

  return L.divIcon({
    html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
      </svg>
    </div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

function FlyToHighlight({ adresses, highlightSlug }: { adresses: Adresse[]; highlightSlug?: string }) {
  const map = useMap();

  useEffect(() => {
    if (highlightSlug) {
      const a = adresses.find((ad) => ad.slug === highlightSlug);
      if (a) {
        map.flyTo([a.coordinates.lat, a.coordinates.lng], 14, { duration: 1 });
      }
    }
  }, [highlightSlug, adresses, map]);

  return null;
}

export default function TastyMap({ adresses, highlightSlug, className }: TastyMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("bg-moselle-cream animate-pulse rounded-xl", className)} />
    );
  }

  return (
    <MapContainer
      center={[MAP_CENTER.lat, MAP_CENTER.lng]}
      zoom={MAP_DEFAULT_ZOOM}
      className={cn("w-full h-full rounded-xl z-0", className)}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToHighlight adresses={adresses} highlightSlug={highlightSlug} />

      {adresses.map((adresse) => (
        <Marker
          key={adresse.id}
          position={[adresse.coordinates.lat, adresse.coordinates.lng]}
          icon={createCategoryIcon(adresse.category)}
        >
          <Popup>
            <div className="min-w-[200px] p-1">
              <div className="flex items-center gap-2 mb-1">
                <TastyScore score={adresse.tastyScore} size="sm" />
                <span className="text-xs font-semibold text-moselle-text-light">
                  {BUDGET_LABELS[adresse.budget]}
                </span>
              </div>
              <h3 className="font-bold text-moselle-text text-sm mb-1">
                {adresse.name}
              </h3>
              <p className="text-xs text-moselle-text-light mb-2 line-clamp-2">
                {adresse.petitPlus}
              </p>
              <Link
                href={`/adresses/${adresse.slug}`}
                className="text-xs font-semibold text-moselle-green hover:underline"
              >
                Voir la fiche →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
