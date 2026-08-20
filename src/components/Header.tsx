import { MapPinned, Moon, Sun, Navigation, NavigationOff, RefreshCw, User } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";
import { LANG_LABELS } from "../i18n/translations";
import type { Lang, Theme, GeoState } from "../types";

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  simulating: boolean;
  onToggleSimulation: () => void;
  geo: GeoState;
  onRetryGeo: () => void;
  onShowGpsHint: (message: string) => void;
  onOpenProfile: () => void;
}

function GpsChip({
  geo,
  onRetry,
  onShowHint,
}: {
  geo: GeoState;
  onRetry: () => void;
  onShowHint: (message: string) => void;
}) {
  const { t } = useI18n();

  const statusMap: Record<GeoState["status"], { label: string; color: string }> = {
    idle: { label: t("gps.locating"), color: "var(--text-muted)" },
    locating: { label: t("gps.locating"), color: "var(--text-muted)" },
    active: { label: t("gps.active"), color: "var(--success)" },
    denied: { label: t("gps.denied"), color: "var(--danger)" },
    error: { label: t("gps.error"), color: "var(--danger)" },
    unsupported: { label: t("gps.unsupported"), color: "var(--danger)" },
  };

  const info = statusMap[geo.status];
  const canRetry = geo.status === "denied" || geo.status === "error";
  const hint = geo.status === "denied" ? t("gps.deniedHint") : t("gps.httpsHint");

  return (
    <button
      type="button"
      onClick={
        canRetry
          ? () => {
              onShowHint(hint);
              onRetry();
            }
          : undefined
      }
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
      style={{ background: "var(--bg-elevated-2)", color: "var(--text)" }}
      title={canRetry ? hint : undefined}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: info.color }} />
      {info.label}
      {canRetry && <RefreshCw size={12} />}
    </button>
  );
}

export default function Header({
  theme,
  onToggleTheme,
  simulating,
  onToggleSimulation,
  geo,
  onRetryGeo,
  onShowGpsHint,
  onOpenProfile,
}: HeaderProps) {
  const { t, lang, setLang } = useI18n();

  return (
    <header
      className="flex items-center justify-between gap-2 border-b px-3 py-2.5"
      style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-2 font-semibold">
        <MapPinned size={20} style={{ color: "var(--accent)" }} />
        <span className="hidden sm:inline">{t("app.name")}</span>
      </div>

      <div className="flex flex-1 items-center justify-center gap-2 overflow-x-auto">
        <GpsChip geo={geo} onRetry={onRetryGeo} onShowHint={onShowGpsHint} />

        <button
          type="button"
          onClick={onToggleSimulation}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
          style={{
            background: simulating ? "var(--accent)" : "var(--bg-elevated-2)",
            color: simulating ? "var(--accent-contrast)" : "var(--text)",
          }}
        >
          {simulating ? <Navigation size={12} /> : <NavigationOff size={12} />}
          {t("header.simulation")}
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
          aria-label={t("header.language")}
          className="rounded-full border-none px-2 py-1.5 text-xs font-medium outline-none"
          style={{ background: "var(--bg-elevated-2)", color: "var(--text)" }}
        >
          {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
            <option key={l} value={l}>
              {LANG_LABELS[l]}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={t("header.theme")}
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{ background: "var(--bg-elevated-2)", color: "var(--text)" }}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button
          type="button"
          onClick={onOpenProfile}
          aria-label={t("header.profile")}
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{ background: "var(--bg-elevated-2)", color: "var(--text)" }}
        >
          <User size={16} />
        </button>
      </div>
    </header>
  );
}
