export const TAG_LIST = [
  { key: "strategy", ko: "전략" },
  { key: "factor", ko: "팩터" },
  { key: "risk", ko: "리스크" },
  { key: "market-structure", ko: "마켓구조" },
  { key: "crypto", ko: "크립토" },
  { key: "derivatives", ko: "파생" },
  { key: "macro-regime", ko: "매크로레짐" },
] as const;

export type TagKey = (typeof TAG_LIST)[number]["key"];

export function getTagLabel(key: string): string {
  const found = TAG_LIST.find((t) => t.key === key);
  return found ? found.ko : key;
}

export function getTagKeyByLabel(label: string): string | null {
  const found = TAG_LIST.find((t) => t.ko === label);
  return found ? found.key : null;
}
