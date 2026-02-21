"use client";

import { TAG_LIST, getTagLabel } from "@/lib/research/data/tagLabels";

interface FilterChipsProps {
  selected: string[];
  onToggle: (tagLabel: string) => void;
}

export function FilterChips({ selected, onToggle }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TAG_LIST.map((tag) => {
        const label = getTagLabel(tag.key);
        return (
          <button
            key={tag.key}
            onClick={() => onToggle(label)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selected.includes(label)
                ? "bg-accent-orange text-white border-2 border-accent-orange"
                : "border-2 border-slate-200 text-slate-700 hover:border-accent-orange hover:text-accent-orange bg-white"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
