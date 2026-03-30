"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS } from "@/lib/market/constants";
import { PERIOD_LABELS, type PeriodKey } from "./marketMonitorState";
import type { MarketMetricRow } from "./mock/marketData";

interface SparklineChartProps {
  row: MarketMetricRow;
  period: PeriodKey;
}

function toneColor(value: number) {
  return value >= 0 ? COLORS.up : COLORS.down;
}

const CHART_GRID_COLOR = "rgb(var(--terminal-divider-rgb) / 0.7)";
const CHART_TICK_COLOR = "rgb(var(--terminal-text-muted-rgb) / 0.72)";
const CHART_CURSOR_COLOR = "rgb(var(--terminal-divider-rgb) / 0.95)";

export function SparklineChart({ row, period }: SparklineChartProps) {
  const data = row.sparkline.map((value, index) => ({
    label: `${index + 1}`,
    value,
  }));

  return (
    <section className="terminal-card p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="terminal-label mb-2">Sparkline</div>
          <h2 className="terminal-heading text-2xl text-text-title">
            {row.name}
          </h2>
        </div>
        <div className="text-right">
          <div className="terminal-label mb-1">{PERIOD_LABELS[period]} Change</div>
          <div className="terminal-number text-2xl">
            <span
              className={row[period] >= 0 ? "text-[#1D9E75]" : "text-[#D85A30]"}
            >
              {row[period] >= 0 ? "+" : ""}
              {row[period].toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={CHART_GRID_COLOR} vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: CHART_TICK_COLOR, fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis
              hide
              domain={["dataMin - 1", "dataMax + 1"]}
            />
            <Tooltip
              cursor={{ stroke: CHART_CURSOR_COLOR, strokeDasharray: "4 4" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={toneColor(row[period])}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: toneColor(row[period]) }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
