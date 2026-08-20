import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";
import type { MessageTag } from "../types";
import { compressImage } from "../utils/image";

interface ComposeModalProps {
  onClose: () => void;
  onSubmit: (input: { title: string; text: string; tag: MessageTag; photo?: string; expiresAt: number | null }) => void;
  cooldownRemaining: number;
}

const TAGS: MessageTag[] = ["message", "memory", "review", "clue"];
const EXPIRIES: { key: string; ms: number | null }[] = [
  { key: "expiryNever", ms: null },
  { key: "expiry1d", ms: 24 * 60 * 60 * 1000 },
  { key: "expiry7d", ms: 7 * 24 * 60 * 60 * 1000 },
  { key: "expiry30d", ms: 30 * 24 * 60 * 60 * 1000 },
];

export default function ComposeModal({ onClose, onSubmit, cooldownRemaining }: ComposeModalProps) {
  const { t } = useI18n();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tag, setTag] = useState<MessageTag>("message");
  const [expiryIdx, setExpiryIdx] = useState(0);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const disabled = cooldownRemaining > 0;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const compressed = await compressImage(file);
    setPhoto(compressed);
  };

  const handleSubmit = () => {
    if (!text.trim()) {
      setError(t("compose.emptyError"));
      return;
    }
    if (disabled) {
      setError(t("compose.rateLimited"));
      return;
    }
    onSubmit({ title, text, tag, photo, expiresAt: EXPIRIES[expiryIdx].ms });
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-2xl p-4 sm:rounded-2xl"
        style={{ background: "var(--bg-elevated)", color: "var(--text)", boxShadow: "var(--shadow)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("compose.title")}</h2>
          <button type="button" onClick={onClose} aria-label={t("common.close")}>
            <X size={20} />
          </button>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("compose.titlePlaceholder")}
          maxLength={80}
          className="mb-2 w-full rounded-lg border px-3 py-2 text-sm outline-none"
          style={{ background: "var(--bg-elevated-2)", borderColor: "var(--border)" }}
        />

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("compose.textPlaceholder")}
          maxLength={500}
          rows={4}
          className="mb-1 w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none"
          style={{ background: "var(--bg-elevated-2)", borderColor: "var(--border)" }}
        />
        <div className="mb-3 text-end text-xs" style={{ color: "var(--text-muted)" }}>
          {t("compose.charCount", { count: text.length })}
        </div>

        <div className="mb-3">
          <div className="mb-1 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            {t("compose.tag")}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TAGS.map((tg) => (
              <button
                key={tg}
                type="button"
                onClick={() => setTag(tg)}
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  background: tag === tg ? "var(--accent)" : "var(--bg-elevated-2)",
                  color: tag === tg ? "var(--accent-contrast)" : "var(--text)",
                }}
              >
                {t(`compose.tag${tg.charAt(0).toUpperCase()}${tg.slice(1)}` as never)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <div className="mb-1 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            {t("compose.expiry")}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {EXPIRIES.map((exp, idx) => (
              <button
                key={exp.key}
                type="button"
                onClick={() => setExpiryIdx(idx)}
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  background: expiryIdx === idx ? "var(--accent)" : "var(--bg-elevated-2)",
                  color: expiryIdx === idx ? "var(--accent-contrast)" : "var(--text)",
                }}
              >
                {t(`compose.${exp.key}` as never)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {photo ? (
            <div className="relative inline-block">
              <img src={photo} alt="" className="h-24 w-24 rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => setPhoto(undefined)}
                className="absolute -top-2 -end-2 flex h-6 w-6 items-center justify-center rounded-full"
                style={{ background: "var(--danger)", color: "white" }}
                aria-label={t("compose.removePhoto")}
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              <Camera size={14} />
              {t("compose.addPhoto")}
            </button>
          )}
        </div>

        {error && (
          <div className="mb-3 text-xs" style={{ color: "var(--danger)" }}>
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border py-2.5 text-sm font-medium"
            style={{ borderColor: "var(--border)" }}
          >
            {t("compose.cancel")}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={disabled}
            className="flex-1 rounded-lg py-2.5 text-sm font-medium disabled:opacity-50"
            style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}
          >
            {disabled ? `${Math.ceil(cooldownRemaining / 1000)}s` : t("compose.submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
