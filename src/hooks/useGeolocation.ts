"use client";

import { useState, useCallback } from "react";

interface GeoPosition {
  lat: number;
  lng: number;
}

export function useGeolocation() {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  const requestPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError("La geolocalisation n'est pas supportee par votre navigateur.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setActive(true);
        setLoading(false);
      },
      (err) => {
        setError(
          err.code === 1
            ? "Localisation refusee. Activez-la dans vos parametres."
            : "Impossible d'obtenir votre position."
        );
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, []);

  const deactivate = useCallback(() => {
    setActive(false);
    setPosition(null);
  }, []);

  return { position, loading, error, active, requestPosition, deactivate };
}
