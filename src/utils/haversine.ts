import type { Coords } from "../types";

const EARTH_RADIUS_M = 6371000;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Distance in meters between two coordinates using the Haversine formula. */
export function haversineDistance(a: Coords, b: Coords): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return EARTH_RADIUS_M * c;
}

export const UNLOCK_RADIUS_METERS = 10;

export function isWithinUnlockRadius(a: Coords, b: Coords): boolean {
  return haversineDistance(a, b) <= UNLOCK_RADIUS_METERS;
}
