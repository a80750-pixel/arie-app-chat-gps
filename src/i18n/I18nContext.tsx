import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Lang } from "../types";
import { translations, RTL_LANGS, type Dictionary } from "./translations";

const LANG_KEY = "spotmessage:lang";

type Path<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object ? `${K}.${Path<T[K]>}` : K;
    }[keyof T & string]
  : never;

export type TranslationKey = Path<Dictionary>;

function resolve(dict: Dictionary, key: string): string {
  const parts = key.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let node: any = dict;
  for (const part of parts) {
    node = node?.[part];
  }
  return typeof node === "string" ? node : key;
}

function detectInitialLang(): Lang {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === "fr" || saved === "en" || saved === "he") return saved;
  const browser = navigator.language.slice(0, 2);
  if (browser === "fr" || browser === "he" || browser === "iw") return browser === "iw" ? "he" : (browser as Lang);
  return "en";
}

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  dir: "ltr" | "rtl";
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitialLang);

  const dir: "ltr" | "rtl" = RTL_LANGS.includes(lang) ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem(LANG_KEY, lang);
  }, [lang, dir]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      let str = resolve(translations[lang], key);
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(`{${k}}`, String(v));
        }
      }
      return str;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, dir, t }), [lang, setLang, dir, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
