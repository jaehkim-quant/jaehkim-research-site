import Link from "next/link";
import { MARKET_CATEGORIES } from "@/lib/market/constants";
import {
  buildMarketMonitorHref,
  type MarketMonitorState,
} from "./marketMonitorState";

interface MarketSubTabsProps {
  state: MarketMonitorState;
}

export function MarketSubTabs({ state }: MarketSubTabsProps) {
  return (
    <section className="terminal-card p-2">
      <div className="grid gap-2 md:grid-cols-5">
        {(
          Object.entries(MARKET_CATEGORIES) as Array<
            [keyof typeof MARKET_CATEGORIES, (typeof MARKET_CATEGORIES)[keyof typeof MARKET_CATEGORIES]]
          >
        ).map(([asset, category]) => {
          const selected = state.asset === asset;

          return (
            <Link
              key={asset}
              href={buildMarketMonitorHref(state, { asset })}
              className={
                selected
                  ? "rounded-sm border border-accent-orange/30 bg-accent-orange/10 px-4 py-3 text-center font-label text-xs uppercase tracking-[0.18em] text-accent-orange"
                  : "rounded-sm border border-border bg-white/[0.02] px-4 py-3 text-center font-label text-xs uppercase tracking-[0.18em] text-text-dark hover:bg-white/[0.05] hover:text-text-title"
              }
            >
              {category.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
