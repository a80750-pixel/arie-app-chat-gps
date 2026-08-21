import { useEffect, useRef, useState } from "react";
import { Plus, List } from "lucide-react";
import { useI18n } from "./i18n/I18nContext";
import { useTheme } from "./hooks/useTheme";
import { useGeolocation } from "./hooks/useGeolocation";
import { useMessages } from "./hooks/useMessages";
import { useToasts } from "./hooks/useToasts";
import { haversineDistance, UNLOCK_RADIUS_METERS } from "./utils/haversine";
import { getDeviceName } from "./utils/id";
import type { SpotMessage } from "./types";

import Header from "./components/Header";
import MapView from "./components/MapView";
import ComposeModal from "./components/ComposeModal";
import DetailSheet from "./components/DetailSheet";
import NearbySheet from "./components/NearbySheet";
import OnboardingModal from "./components/OnboardingModal";
import ProfileModal from "./components/ProfileModal";
import ToastStack from "./components/ToastStack";

const ONBOARDING_KEY = "spotmessage:onboarded";
const UNLOCKED_IDS_KEY = "spotmessage:unlockedIds";

function loadUnlockedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(UNLOCKED_IDS_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export default function App() {
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const geo = useGeolocation();
  const messagesStore = useMessages();
  const { toasts, pushToast } = useToasts();

  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem(ONBOARDING_KEY));
  const [showCompose, setShowCompose] = useState(false);
  const [showNearby, setShowNearby] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [profileName, setProfileName] = useState(getDeviceName());
  const selected = selectedId ? messagesStore.messages.find((m) => m.id === selectedId) ?? null : null;

  const unlockedIdsRef = useRef<Set<string>>(loadUnlockedIds());
  const [unlockedCount, setUnlockedCount] = useState(unlockedIdsRef.current.size);

  useEffect(() => {
    if (!geo.coords) return;
    let changed = false;
    for (const m of messagesStore.messages) {
      const distance = haversineDistance(geo.coords, { lat: m.lat, lng: m.lng });
      const isUnlocked = distance <= UNLOCK_RADIUS_METERS;
      if (isUnlocked && !unlockedIdsRef.current.has(m.id)) {
        unlockedIdsRef.current.add(m.id);
        changed = true;
        if (m.authorId !== messagesStore.deviceId) {
          pushToast(t("toast.unlocked"));
          if (navigator.vibrate) navigator.vibrate(120);
        }
      }
    }
    if (changed) {
      localStorage.setItem(UNLOCKED_IDS_KEY, JSON.stringify(Array.from(unlockedIdsRef.current)));
      setUnlockedCount(unlockedIdsRef.current.size);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo.coords, messagesStore.messages]);

  const selectedDistance =
    selected && geo.coords ? haversineDistance(geo.coords, { lat: selected.lat, lng: selected.lng }) : Infinity;
  const selectedLocked = selectedDistance > UNLOCK_RADIUS_METERS;

  const droppedCount = messagesStore.messages.filter((m) => m.authorId === messagesStore.deviceId).length;

  const handleCompose = async (input: { title: string; text: string; tag: SpotMessage["tag"]; photo?: string; expiresAt: number | null }) => {
    if (!geo.realCoords) return;
    const result = await messagesStore.addMessage({ ...input, lat: geo.realCoords.lat, lng: geo.realCoords.lng });
    if (result.ok) {
      setShowCompose(false);
      pushToast(t("toast.dropped"));
    } else if (result.reason === "network") {
      pushToast(t("toast.networkError"));
    }
  };

  const handleShare = async (message: SpotMessage) => {
    const url = `${window.location.origin}${window.location.pathname}?spot=${message.id}`;
    try {
      await navigator.clipboard.writeText(url);
      pushToast(t("detail.shareCopied"));
    } catch {
      // clipboard unavailable, ignore
    }
  };

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden" style={{ background: "var(--bg)" }}>
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        simulating={geo.simulating}
        onToggleSimulation={geo.toggleSimulation}
        geo={geo}
        onRetryGeo={geo.retry}
        onShowGpsHint={pushToast}
        onOpenProfile={() => setShowProfile(true)}
      />

      <div className="relative flex-1">
        <MapView
          userCoords={geo.coords}
          simulating={geo.simulating}
          onSimulatedMove={geo.moveSimulatedPosition}
          messages={messagesStore.messages}
          favorites={messagesStore.favorites}
          onSelectMessage={(m) => setSelectedId(m.id)}
        />

        {geo.simulating && (
          <div
            className="pointer-events-none absolute inset-x-0 top-2 z-[500] mx-auto w-fit max-w-[90%] rounded-full px-3 py-1.5 text-center text-xs font-medium"
            style={{ background: "var(--bg-elevated)", color: "var(--text)", boxShadow: "var(--shadow)" }}
          >
            {t("map.simHint")}
          </div>
        )}

        {!geo.simulating && !selected && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-3 z-[500] mx-auto w-fit max-w-[90%] rounded-full px-3 py-1.5 text-center text-xs font-medium"
            style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", boxShadow: "var(--shadow)" }}
          >
            {t("map.dropHint")}
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowNearby(true)}
          className="absolute bottom-24 start-3 z-[500] flex h-11 w-11 items-center justify-center rounded-full"
          style={{ background: "var(--bg-elevated)", color: "var(--text)", boxShadow: "var(--shadow)" }}
          aria-label={t("nearby.title")}
        >
          <List size={20} />
        </button>

        <button
          type="button"
          onClick={() => setShowCompose(true)}
          disabled={!geo.realCoords || geo.simulating}
          className="absolute bottom-6 start-1/2 z-[500] flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full disabled:opacity-50"
          style={{ background: "var(--accent)", color: "var(--accent-contrast)", boxShadow: "var(--shadow)" }}
          aria-label={t("compose.title")}
        >
          <Plus size={26} />
        </button>
      </div>

      <ToastStack toasts={toasts} />

      {showOnboarding && (
        <OnboardingModal
          onStart={() => {
            localStorage.setItem(ONBOARDING_KEY, "1");
            setShowOnboarding(false);
          }}
        />
      )}

      {showCompose && (
        <ComposeModal
          onClose={() => setShowCompose(false)}
          onSubmit={handleCompose}
          cooldownRemaining={messagesStore.cooldownRemaining}
        />
      )}

      {showNearby && (
        <NearbySheet
          messages={messagesStore.messages}
          userCoords={geo.coords}
          favorites={messagesStore.favorites}
          onClose={() => setShowNearby(false)}
          onSelect={(m) => {
            setSelectedId(m.id);
            setShowNearby(false);
          }}
        />
      )}

      {showProfile && (
        <ProfileModal
          name={profileName}
          dropped={droppedCount}
          unlocked={unlockedCount}
          onClose={() => setShowProfile(false)}
          onSave={setProfileName}
        />
      )}

      {selected && (
        <DetailSheet
          message={selected}
          distance={selectedDistance}
          locked={selectedLocked}
          deviceId={messagesStore.deviceId}
          favorite={messagesStore.favorites.has(selected.id)}
          onClose={() => setSelectedId(null)}
          onToggleLike={() => messagesStore.toggleLike(selected.id)}
          onAddComment={(text) => messagesStore.addComment(selected.id, text)}
          onToggleFavorite={() => messagesStore.toggleFavorite(selected.id)}
          onDelete={() => {
            messagesStore.deleteMessage(selected.id);
            setSelectedId(null);
            pushToast(t("toast.deleted"));
          }}
          onReport={() => {
            messagesStore.reportMessage(selected.id);
            setSelectedId(null);
            pushToast(t("toast.reported"));
          }}
          onShare={() => handleShare(selected)}
        />
      )}
    </div>
  );
}
