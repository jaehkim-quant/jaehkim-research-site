"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";

const badgeKeys = [
  { key: "lookahead", icon: "✓" },
  { key: "costs", icon: "¢" },
  { key: "walkforward", icon: "→" },
  { key: "risk", icon: "σ" },
];

export function MiniBadgeRow() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {badgeKeys.map(({ key, icon }) => (
        <div
          key={key}
          className="flex items-center gap-2 text-sm text-slate-600"
        >
          <span className="w-9 h-9 rounded-lg bg-accent-orange/10 flex items-center justify-center text-accent-orange font-mono font-bold">
            {icon}
          </span>
          <span>{t(`home.validationBadges.${key}`)}</span>
        </div>
      ))}
    </div>
  );
}
