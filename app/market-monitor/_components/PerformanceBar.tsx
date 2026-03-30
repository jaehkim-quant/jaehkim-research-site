"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS, MARKET_CATEGORIES } from "@/lib/market/constants";
import type { MarketAssetKey } from "./marketMonitorState";
import type { MarketMetricRow } from "./mock/marketData";

interface PerformanceBarProps {
  asset: MarketAssetKey;
  rows: MarketMetricRow[];
}

const CHART_GRID_COLOR = "rgb(var(--terminal-divider-rgb) / 0.55)";
const AXIS_TICK_COLOR = "rgb(var(--terminal-text-muted-rgb) / 0.72)";
const AXIS_LABEL_COLOR = "rgb(var(--terminal-text-strong-rgb) / 0.82)";
const CHART_CURSOR_FILL = "rgb(var(--terminal-divider-rgb) / 0.22)";

export function PerformanceBar({ asset, rows }: PerformanceBarProps) {
  const data = [...rows]
    .sort((a, b) => b.ytd - a.ytd)
    .map((row) => ({
      name: row.name.replace(/\s*\(.+\)$/, ""),
      ytd: row.ytd,
    }));

  return (
    <section className="terminal-card p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="terminal-label mb-2">Performance Bar</div>
          <h2 className="terminal-heading text-2xl text-text-title">
            {MARKET_CATEGORIES[asset].label} YTD 비교
          </h2>
        </div>
        <span className="terminal-badge terminal-badge-neutral">
          {rows.length} indices
        </span>
      </div>

      <div className="h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 8, left: 12, bottom: 4 }}
          >
            <CartesianGrid stroke={CHART_GRID_COLOR} horizontal={false} />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{ fill: AXIS_TICK_COLOR, fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              width={96}
              tick={{ fill: AXIS_LABEL_COLOR, fontSize: 11 }}
            />
            <Tooltip
              cursor={{ fill: CHART_CURSOR_FILL }}
              labelStyle={{ color: "#131313" }}
            />
            <Bar dataKey="ytd" radius={[0, 4, 4, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.ytd >= 0 ? COLORS.up : COLORS.down}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
