import { useMemo, useState } from "react";
import { X, Lock, Star } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";
import type { Coords, SpotMessage } from "../types";
import { haversineDistance, UNLOCK_RADIUS_METERS } from "../utils/haversine";
import { formatDistance } from "../utils/format";

interface NearbySheetProps {
  messages: SpotMessage[];
  userCoords: Coords | null;
  favorites: Set<string>;
  onClose: () => void;
  onSelect: (m: SpotMessage) => void;
}

export default function NearbySheet({ messages, userCoords, favorites, onClose, onSelect }: NearbySheetProps) {
  const { t } = useI18n();
  const [tab, setTab] = useState<"nearby" | "favorites">("nearby");

  const ranked = useMemo(() => {
    return messages
      .map((m) => ({
        message: m,
        distance: userCoords ? haversineDistance(userCoords, { lat: m.lat, lng: m.lng }) : Infinity,
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [messages, userCoords]);

  const list = tab === "nearby" ? ranked : ranked.filter((r) => favorites.has(r.message.id));

  return (
    <div className="fixed inset-0 z-[1050] flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div
        className="max-h-[75vh] w-full max-w-md overflow-y-auto rounded-t-2xl p-4 sm:rounded-2xl"
        style={{ background: "var(--bg-elevated)", color: "var(--text)", boxShadow: "var(--shadow)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTab("nearby")}
              className="rounded-full px-3 py-1.5 text-sm font-medium"
              style={{
                background: tab === "nearby" ? "var(--accent)" : "var(--bg-elevated-2)",
                color: tab === "nearby" ? "var(--accent-contrast)" : "var(--text)",
              }}
            >
              {t("nearby.title")}
            </button>
            <button
              type="button"
              onClick={() => setTab("favorites")}
              className="rounded-full px-3 py-1.5 text-sm font-medium"
              style={{
                background: tab === "favorites" ? "var(--accent)" : "var(--bg-elevated-2)",
                color: tab === "favorites" ? "var(--accent-contrast)" : "var(--text)",
              }}
            >
              {t("nearby.favoritesTitle")}
            </button>
          </div>
          <button type="button" onClick={onClose} aria-label={t("common.close")}>
            <X size={20} />
          </button>
        </div>

        {list.length === 0 ? (
          <p className="py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            {tab === "nearby" ? t("nearby.empty") : t("nearby.favoritesEmpty")}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {list.map(({ message, distance }) => {
              const locked = distance > UNLOCK_RADIUS_METERS;
              return (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => onSelect(message)}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-start"
                  style={{ background: "var(--bg-elevated-2)" }}
                >
                  <div className="flex items-center gap-2">
                    {locked && <Lock size={14} style={{ color: "var(--locked)" }} />}
                    {favorites.has(message.id) && <Star size={14} fill="#facc15" color="#facc15" />}
                    <span className="text-sm font-medium">
                      {locked ? t("nearby.locked") : message.title || t("nearby.unlocked")}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {t("nearby.away", { distance: formatDistance(distance, t("common.meters")) })}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
