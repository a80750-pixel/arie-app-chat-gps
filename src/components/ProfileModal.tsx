import { useState } from "react";
import { X } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";
import { setDeviceName } from "../utils/id";

interface ProfileModalProps {
  name: string;
  dropped: number;
  unlocked: number;
  onClose: () => void;
  onSave: (name: string) => void;
}

export default function ProfileModal({ name, dropped, unlocked, onClose, onSave }: ProfileModalProps) {
  const { t } = useI18n();
  const [value, setValue] = useState(name);

  return (
    <div className="fixed inset-0 z-[1150] flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-t-2xl p-4 sm:rounded-2xl"
        style={{ background: "var(--bg-elevated)", color: "var(--text)", boxShadow: "var(--shadow)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("profile.title")}</h2>
          <button type="button" onClick={onClose} aria-label={t("common.close")}>
            <X size={20} />
          </button>
        </div>

        <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          {t("profile.nameLabel")}
        </label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={40}
          className="mb-4 w-full rounded-lg border px-3 py-2 text-sm outline-none"
          style={{ background: "var(--bg-elevated-2)", borderColor: "var(--border)" }}
        />

        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg p-3 text-center" style={{ background: "var(--bg-elevated-2)" }}>
            <div className="text-xl font-semibold">{dropped}</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              {t("profile.notesDropped")}
            </div>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ background: "var(--bg-elevated-2)" }}>
            <div className="text-xl font-semibold">{unlocked}</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              {t("profile.notesUnlocked")}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const trimmed = value.trim() || name;
            setDeviceName(trimmed);
            onSave(trimmed);
            onClose();
          }}
          className="w-full rounded-lg py-2.5 text-sm font-medium"
          style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}
        >
          {t("profile.save")}
        </button>
      </div>
    </div>
  );
}
