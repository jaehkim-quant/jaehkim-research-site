import type { Locale } from "@/lib/i18n/translations";

export const TAG_LIST = [
  { key: "strategy", en: "Strategy", ko: "전략" },
  { key: "factor", en: "Factor", ko: "팩터" },
  { key: "risk", en: "Risk", ko: "리스크" },
  { key: "market-structure", en: "Market Structure", ko: "마켓구조" },
  { key: "crypto", en: "Crypto", ko: "크립토" },
  { key: "derivatives", en: "Derivatives", ko: "파생" },
  { key: "macro-regime", en: "Macro Regime", ko: "매크로레짐" },
] as const;

export type TagKey = (typeof TAG_LIST)[number]["key"];

export function getTagLabel(key: string, locale: Locale): string {
  const found = TAG_LIST.find((t) => t.key === key);
  return found ? found[locale] : key;
}

export function getTagKeyByLabel(label: string): string | null {
  const found = TAG_LIST.find((t) => t.en === label || t.ko === label);
  return found ? found.key : null;
}
