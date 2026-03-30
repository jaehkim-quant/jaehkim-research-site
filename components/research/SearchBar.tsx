"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";

export function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const { t } = useTranslation();

  return (
    <div className="terminal-card flex items-center gap-3 px-4 py-3">
      <span className="terminal-label text-accent-orange">Search</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? t("research.searchPlaceholder")}
        className="w-full bg-transparent text-sm text-text-title placeholder:text-text-dark focus:outline-none"
      />
    </div>
  );
}
