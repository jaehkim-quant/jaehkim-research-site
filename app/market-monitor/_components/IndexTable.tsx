"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";
import {
  PERIOD_LABELS,
  PERIOD_OPTIONS,
  buildMarketMonitorHref,
  type MarketMonitorState,
} from "./marketMonitorState";
import type { MarketMetricRow } from "./mock/marketData";

interface IndexTableProps {
  rows: MarketMetricRow[];
  state: MarketMonitorState;
}

function toneClass(value: number) {
  return value >= 0 ? "text-[#1D9E75]" : "text-[#D85A30]";
}

function formatSignedPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function formatPrice(value: number, currency: string) {
  const decimalDigits = value < 10 ? 2 : value < 100 ? 2 : 1;

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimalDigits,
    maximumFractionDigits: decimalDigits,
  }).format(value) + (currency === "USD" ? "" : ` ${currency}`);
}

export function IndexTable({ rows, state }: IndexTableProps) {
  const router = useRouter();
  const sortedRows = [...rows].sort((a, b) => b[state.period] - a[state.period]);

  const pushHref = (href: string) => {
    startTransition(() => {
      router.push(href, { scroll: false });
    });
  };

  return (
    <section className="terminal-card p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="terminal-label mb-2">Index Table</div>
          <h2 className="terminal-heading text-2xl text-text-title">
            주요 지수와 기간별 성과
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {PERIOD_OPTIONS.map((period) => (
            <button
              key={period}
              type="button"
              onClick={() =>
                pushHref(buildMarketMonitorHref(state, { period }))
              }
              className={
                state.period === period
                  ? "rounded-sm border border-accent-orange/30 bg-accent-orange/10 px-3 py-2 font-label text-[0.68rem] uppercase tracking-[0.16em] text-accent-orange"
                  : "rounded-sm border border-border bg-white/[0.02] px-3 py-2 font-label text-[0.68rem] uppercase tracking-[0.16em] text-text-dark hover:bg-white/[0.05] hover:text-text-title"
              }
            >
              {PERIOD_LABELS[period]}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-xs text-text-dark">
              <th className="px-4 py-2 font-label uppercase tracking-[0.16em]">
                이름
              </th>
              <th className="px-4 py-2 font-label uppercase tracking-[0.16em]">
                지역
              </th>
              <th className="px-4 py-2 font-label uppercase tracking-[0.16em]">
                가격
              </th>
              <th className="px-4 py-2 font-label uppercase tracking-[0.16em] text-accent-orange">
                {PERIOD_LABELS[state.period]}
              </th>
              <th className="px-4 py-2 font-label uppercase tracking-[0.16em]">
                YTD
              </th>
              <th className="px-4 py-2 font-label uppercase tracking-[0.16em]">
                1Y
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => {
              const selected = row.symbol === state.symbol;

              return (
                <tr
                  key={row.symbol}
                  onClick={() =>
                    pushHref(buildMarketMonitorHref(state, { symbol: row.symbol }))
                  }
                  className={`cursor-pointer rounded-sm border transition-colors ${
                    selected
                      ? "bg-white/8 text-text-title ring-1 ring-inset ring-accent-orange/25"
                      : "bg-white/[0.02] text-text-dark hover:bg-white/[0.05] hover:text-text-title"
                  }`}
                >
                  <td className="rounded-l-sm px-4 py-4">
                    <div className="font-medium text-current">{row.name}</div>
                    <div className="mt-1 text-xs text-text-dark/80">
                      {row.symbol}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">{row.region}</td>
                  <td className="px-4 py-4 text-sm">
                    {formatPrice(row.price, row.currency)}
                  </td>
                  <td className={`px-4 py-4 text-sm font-semibold ${toneClass(row[state.period])}`}>
                    {formatSignedPercent(row[state.period])}
                  </td>
                  <td className={`px-4 py-4 text-sm ${toneClass(row.ytd)}`}>
                    {formatSignedPercent(row.ytd)}
                  </td>
                  <td className={`rounded-r-sm px-4 py-4 text-sm ${toneClass(row.y)}`}>
                    {formatSignedPercent(row.y)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
