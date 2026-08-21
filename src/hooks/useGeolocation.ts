import { useCallback, useEffect, useRef, useState } from "react";
import type { Coords, GeoState } from "../types";

const DEFAULT_FALLBACK: Coords = { lat: 48.8566, lng: 2.3522 }; // Paris, used only until a real/simulated fix exists

function isSecureContextOk(): boolean {
  return window.isSecureContext !== false;
}

export function useGeolocation() {
  const [geo, setGeo] = useState<GeoState>({
    coords: null,
    accuracy: null,
    status: "idle",
    errorMessage: null,
  });

  const [simulating, setSimulating] = useState(false);
  const [simulatedCoords, setSimulatedCoords] = useState<Coords | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const startWatch = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setGeo((g) => ({ ...g, status: "unsupported", errorMessage: null }));
      return;
    }
    if (!isSecureContextOk()) {
      setGeo((g) => ({
        ...g,
        status: "error",
        errorMessage: "insecure-context",
      }));
      return;
    }

    setGeo((g) => ({ ...g, status: "locating" }));

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setGeo({
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          accuracy: pos.coords.accuracy,
          status: "active",
          errorMessage: null,
        });
      },
      (err) => {
        setGeo((g) => ({
          ...g,
          status: err.code === err.PERMISSION_DENIED ? "denied" : "error",
          errorMessage: err.message || null,
        }));
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 20000,
      },
    );
  }, []);

  useEffect(() => {
    startWatch();
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retry = useCallback(() => {
    startWatch();
  }, [startWatch]);

  const toggleSimulation = useCallback(() => {
    setSimulating((prev) => {
      const next = !prev;
      if (next && !simulatedCoords) {
        setSimulatedCoords(geo.coords ?? DEFAULT_FALLBACK);
      }
      return next;
    });
  }, [simulatedCoords, geo.coords]);

  const moveSimulatedPosition = useCallback((coords: Coords) => {
    setSimulatedCoords(coords);
  }, []);

  const effectiveCoords = simulating ? simulatedCoords ?? DEFAULT_FALLBACK : geo.coords;

  return {
    ...geo,
    coords: effectiveCoords,
    realCoords: geo.coords,
    realStatus: geo.status,
    simulating,
    toggleSimulation,
    moveSimulatedPosition,
    retry,
  };
}
