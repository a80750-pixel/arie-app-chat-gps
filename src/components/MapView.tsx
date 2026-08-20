import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { LocateFixed } from "lucide-react";
import type { Coords, SpotMessage } from "../types";
import { haversineDistance, UNLOCK_RADIUS_METERS } from "../utils/haversine";
import { useI18n } from "../i18n/I18nContext";

import "leaflet/dist/leaflet.css";

const TAG_COLORS: Record<string, string> = {
  memory: "#f59e0b",
  review: "#0ea5e9",
  message: "#22c55e",
  clue: "#ec4899",
};

function userDivIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="width:18px;height:18px;border-radius:9999px;background:var(--accent);border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);" class="pulse-dot"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function pinDivIcon(locked: boolean, tag: string, favorite: boolean) {
  const color = locked ? "var(--locked)" : TAG_COLORS[tag] ?? "var(--accent)";
  const lockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
  const starSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="white" stroke="white"><polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9 12 2"/></svg>`;
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:30px;height:30px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;">
      <div style="transform:rotate(45deg);">${locked ? lockSvg : starSvg}</div>
      ${favorite ? '<div style="position:absolute;top:-4px;right:-4px;width:10px;height:10px;border-radius:9999px;background:#facc15;border:1.5px solid white;transform:rotate(45deg);"></div>' : ""}
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
}

function ClickHandler({ enabled, onClick }: { enabled: boolean; onClick: (c: Coords) => void }) {
  useMapEvents({
    click(e) {
      if (enabled) onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function RecenterControl({ coords }: { coords: Coords | null }) {
  const map = useMap();
  return (
    <button
      type="button"
      onClick={() => coords && map.flyTo([coords.lat, coords.lng], Math.max(map.getZoom(), 17))}
      className="absolute bottom-24 end-3 z-[500] flex h-11 w-11 items-center justify-center rounded-full shadow-lg"
      style={{ background: "var(--bg-elevated)", color: "var(--text)", boxShadow: "var(--shadow)" }}
      aria-label="recenter"
    >
      <LocateFixed size={20} />
    </button>
  );
}

function InitialCenter({ coords }: { coords: Coords | null }) {
  const map = useMap();
  const done = useRef(false);
  useEffect(() => {
    if (coords && !done.current) {
      map.setView([coords.lat, coords.lng], 17);
      done.current = true;
    }
  }, [coords, map]);
  return null;
}

interface MapViewProps {
  userCoords: Coords | null;
  simulating: boolean;
  onSimulatedMove: (c: Coords) => void;
  messages: SpotMessage[];
  favorites: Set<string>;
  onSelectMessage: (m: SpotMessage) => void;
}

export default function MapView({
  userCoords,
  simulating,
  onSimulatedMove,
  messages,
  favorites,
  onSelectMessage,
}: MapViewProps) {
  const { dir } = useI18n();
  const fallback: Coords = { lat: 48.8566, lng: 2.3522 };
  const center = userCoords ?? fallback;

  const markers = useMemo(() => {
    return messages.map((m) => {
      const distance = userCoords ? haversineDistance(userCoords, { lat: m.lat, lng: m.lng }) : Infinity;
      const locked = distance > UNLOCK_RADIUS_METERS;
      return { message: m, locked, distance };
    });
  }, [messages, userCoords]);

  return (
    <div className="relative h-full w-full" dir={dir}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={17}
        zoomControl={false}
        className="h-full w-full"
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <InitialCenter coords={userCoords} />
        <ClickHandler enabled={simulating} onClick={onSimulatedMove} />

        {userCoords && (
          <>
            <Circle
              center={[userCoords.lat, userCoords.lng]}
              radius={UNLOCK_RADIUS_METERS}
              pathOptions={{ color: "#2563eb", fillColor: "#2563eb", fillOpacity: 0.1, weight: 1.5 }}
            />
            <Marker
              position={[userCoords.lat, userCoords.lng]}
              icon={userDivIcon()}
              draggable={simulating}
              eventHandlers={{
                dragend: (e) => {
                  const pos = e.target.getLatLng();
                  onSimulatedMove({ lat: pos.lat, lng: pos.lng });
                },
              }}
            />
          </>
        )}

        {markers.map(({ message, locked }) => (
          <Marker
            key={message.id}
            position={[message.lat, message.lng]}
            icon={pinDivIcon(locked, message.tag, favorites.has(message.id))}
            eventHandlers={{
              click: () => onSelectMessage(message),
            }}
          />
        ))}

        <RecenterControl coords={userCoords} />
      </MapContainer>
    </div>
  );
}
