import { MapPin, Lock, MousePointerClick } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";
import { LANG_LABELS } from "../i18n/translations";
import type { Lang } from "../types";

export default function OnboardingModal({ onStart }: { onStart: () => void }) {
  const { t, lang, setLang } = useI18n();

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-sm rounded-2xl p-5 text-center"
        style={{ background: "var(--bg-elevated)", color: "var(--text)", boxShadow: "var(--shadow)" }}
      >
        <div className="mb-3 flex justify-center">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            aria-label={t("header.language")}
            className="rounded-full border-none px-2.5 py-1 text-xs font-medium outline-none"
            style={{ background: "var(--bg-elevated-2)", color: "var(--text)" }}
          >
            {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
              <option key={l} value={l}>
                {LANG_LABELS[l]}
              </option>
            ))}
          </select>
        </div>

        <h2 className="mb-4 text-lg font-semibold">{t("onboarding.title")}</h2>

        <div className="mb-4 flex flex-col gap-4 text-start">
          <div className="flex items-start gap-3">
            <MapPin size={20} style={{ color: "var(--accent)" }} className="mt-0.5 shrink-0" />
            <p className="text-sm">{t("onboarding.step1")}</p>
          </div>
          <div className="flex items-start gap-3">
            <Lock size={20} style={{ color: "var(--locked)" }} className="mt-0.5 shrink-0" />
            <p className="text-sm">{t("onboarding.step2")}</p>
          </div>
          <div className="flex items-start gap-3">
            <MousePointerClick size={20} style={{ color: "var(--success)" }} className="mt-0.5 shrink-0" />
            <p className="text-sm">{t("onboarding.step3")}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="w-full rounded-lg py-2.5 text-sm font-medium"
          style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}
        >
          {t("onboarding.start")}
        </button>
      </div>
    </div>
  );
}
