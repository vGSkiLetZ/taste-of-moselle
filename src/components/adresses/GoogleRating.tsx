"use client";

import { Star } from "lucide-react";

interface GoogleRatingProps {
  googleMapsId?: string;
  className?: string;
}

// Client-side component that fetches Google Places rating
// Uses our API proxy to avoid exposing the API key
export default function GoogleRating({ googleMapsId, className = "" }: GoogleRatingProps) {
  if (!googleMapsId) return null;

  // Link to Google Maps page for the place
  const mapsUrl = `https://www.google.com/maps/place/?q=place_id:${googleMapsId}`;

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-sm border border-moselle-cream-dark hover:shadow-md transition-shadow ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335"/>
        <circle cx="12" cy="9" r="2.5" fill="white"/>
      </svg>
      <span className="text-xs font-semibold text-moselle-text">Voir sur Google Maps</span>
      <Star size={12} className="fill-yellow-400 text-yellow-400" />
    </a>
  );
}
