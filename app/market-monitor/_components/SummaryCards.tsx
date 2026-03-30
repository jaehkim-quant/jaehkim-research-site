import { PERIOD_LABELS, type PeriodKey } from "./marketMonitorState";
import type { MarketMetricRow } from "./mock/marketData";

interface SummaryCardsProps {
  row: MarketMetricRow;
}

function toneClass(value: number) {
  return value >= 0 ? "text-[#1D9E75]" : "text-[#D85A30]";
}

function formatSignedPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function SummaryCards({ row }: SummaryCardsProps) {
  return (
    <section className="grid gap-3 md:grid-cols-5">
      {(["d", "w", "m", "ytd", "y"] as PeriodKey[]).map((period) => (
        <div key={period} className="terminal-card p-5">
          <div className="terminal-label mb-3">{PERIOD_LABELS[period]}</div>
          <div className={`terminal-number text-2xl ${toneClass(row[period])}`}>
            {formatSignedPercent(row[period])}
          </div>
          <p className="mt-3 text-sm text-text-dark">{row.name}</p>
        </div>
      ))}
    </section>
  );
}
