"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  MARKET_VIEW_OPTIONS,
  buildMarketMonitorHref,
  normalizeMarketMonitorState,
  type MarketView,
} from "./marketMonitorState";

function ViewIcon({ view }: { view: MarketView }) {
  const sharedProps = {
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    className: "h-5 w-5 fill-none stroke-current",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (view === "daily") {
    return (
      <svg {...sharedProps}>
        <rect x="4" y="4" width="6" height="6" rx="1.2" />
        <rect x="14" y="4" width="6" height="6" rx="1.2" />
        <rect x="4" y="14" width="6" height="6" rx="1.2" />
        <rect x="14" y="14" width="6" height="6" rx="1.2" />
      </svg>
    );
  }

  if (view === "regime") {
    return (
      <svg {...sharedProps}>
        <circle cx="12" cy="12" r="7.5" />
        <path d="M12 8.2v4.3l2.9 1.7" />
      </svg>
    );
  }

  return (
    <svg {...sharedProps}>
      <path d="M4.5 18.5h15" />
      <path d="M6.5 15.5 10 12l3 2.5 4.5-6" />
      <path d="m15.8 8.8 1.8.1-.2 1.8" />
    </svg>
  );
}

export function Sidebar() {
  const searchParams = useSearchParams();
  const state = normalizeMarketMonitorState(
    Object.fromEntries(searchParams.entries()),
  );

  return (
    <div className="xl:sticky xl:top-2 xl:self-start">
      <nav className="terminal-card grid grid-cols-3 gap-2 p-2 xl:hidden">
        {MARKET_VIEW_OPTIONS.map((item) => {
          const selected = state.view === item.id;

          return (
            <Link
              key={item.id}
              href={buildMarketMonitorHref(state, { view: item.id })}
              className={
                selected
                  ? "rounded-sm border border-accent-orange/30 bg-accent-orange/10 px-3 py-3 text-center font-label text-[0.66rem] uppercase tracking-[0.16em] text-accent-orange"
                  : "rounded-sm border border-border bg-white/[0.02] px-3 py-3 text-center font-label text-[0.66rem] uppercase tracking-[0.16em] text-text-dark hover:bg-white/[0.05] hover:text-text-title"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <aside className="group/sidebar hidden w-14 shrink-0 overflow-hidden rounded-sm border border-border bg-black/20 transition-[width] duration-[220ms] ease-[cubic-bezier(.4,0,.2,1)] xl:flex xl:flex-col xl:hover:w-[200px]">
        <div className="border-b border-border/80 px-3 py-4">
          <div className="flex items-center justify-center gap-3 text-accent-orange group-hover/sidebar:justify-between">
            <span className="terminal-number text-xs">MM</span>
            <span className="terminal-label whitespace-nowrap opacity-0 -translate-x-1 transition-all duration-200 group-hover/sidebar:translate-x-0 group-hover/sidebar:opacity-100">
              Market Monitor
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-1 p-2">
          {MARKET_VIEW_OPTIONS.map((item) => {
            const selected = state.view === item.id;

            return (
              <Link
                key={item.id}
                href={buildMarketMonitorHref(state, { view: item.id })}
                className={`flex items-center gap-3 overflow-hidden border-l-2 px-3 py-3 transition-colors ${
                  selected
                    ? "border-accent-orange bg-white/6 text-accent-orange"
                    : "border-transparent text-text-dark hover:bg-white/4 hover:text-text-title"
                }`}
                title={item.label}
              >
                <span className="shrink-0">
                  <ViewIcon view={item.id} />
                </span>
                <span className="whitespace-nowrap text-sm font-medium opacity-0 -translate-x-2 transition-all duration-200 group-hover/sidebar:translate-x-0 group-hover/sidebar:opacity-100">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
