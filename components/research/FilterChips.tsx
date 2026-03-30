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
        const active = selected.includes(label);

        return (
          <button
            key={tag.key}
            type="button"
            onClick={() => onToggle(label)}
            className={`terminal-badge ${active ? "terminal-badge-amber" : "terminal-badge-neutral"} rounded-sm px-3 py-2 hover:text-text-title`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
