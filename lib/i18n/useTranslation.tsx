"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Locale } from "./translations";
import { defaultLocale, translations } from "./translations";

type TranslationKeys = (typeof translations.en) & Record<string, unknown>;

function getNested(obj: TranslationKeys, path: string): string | TranslationKeys {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    }
  }
  return current as string | TranslationKeys;
}

const LanguageContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  tArray: (key: string) => string[];
  tObj: (key: string) => Record<string, unknown>;
}>({
  locale: defaultLocale,
  setLocale: () => {},
  t: () => "",
  tArray: () => [],
  tObj: () => ({}),
});

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  const data = document.documentElement.getAttribute("data-locale");
  if (data === "ko" || data === "en") return data;
  try {
    const stored = localStorage.getItem("locale") as Locale | null;
    return stored === "ko" || stored === "en" ? stored : defaultLocale;
  } catch {
    return defaultLocale;
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("locale", locale);
      document.documentElement.lang = locale === "ko" ? "ko" : "en";
    }
  }, [locale, mounted]);

  const t = (key: string): string => {
    const val = getNested(translations[locale] as TranslationKeys, key);
    return typeof val === "string" ? val : key;
  };

  const tArray = (key: string): string[] => {
    const val = getNested(translations[locale] as TranslationKeys, key);
    return Array.isArray(val) ? val : [];
  };

  const tObj = (key: string): Record<string, unknown> => {
    const val = getNested(translations[locale] as TranslationKeys, key);
    return (val && typeof val === "object" && !Array.isArray(val) ? val : {}) as Record<string, unknown>;
  };

  const setLocale = (l: Locale) => setLocaleState(l);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, tArray, tObj }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useTranslation = () => useContext(LanguageContext);
