"use client";

import { createContext, useContext } from "react";
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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = defaultLocale;

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

  return (
    <LanguageContext.Provider value={{ locale, setLocale: () => {}, t, tArray, tObj }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useTranslation = () => useContext(LanguageContext);
