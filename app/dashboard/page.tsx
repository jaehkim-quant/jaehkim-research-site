"use client";

import { useState } from "react";

const strategies = [
  {
    id: "1",
    name: "모멘텀 팩터",
    objective: "12M 모멘텀 기반 롱숏",
    regimeStatus: "ON" as const,
    liveMode: "paper" as const,
    metrics: { mdd: 8.2, sharpe: 1.1, turnover: 120 },
  },
  {
    id: "2",
    name: "볼 타깃",
    objective: "연 10% 목표 변동성",
    regimeStatus: "OFF" as const,
    liveMode: "paper" as const,
    metrics: { mdd: 5.1, sharpe: 0.9, turnover: 30 },
  },
  {
    id: "3",
    name: "매크로 레짐",
    objective: "레짐 스위칭 기반",
    regimeStatus: "ON" as const,
    liveMode: "live" as const,
    metrics: { mdd: 6.3, sharpe: 1.0, turnover: 15 },
  },
];

export default function PerformanceDashboardPage() {
  const [liveMode, setLiveMode] = useState<"all" | "paper" | "live">("all");

  const filtered =
    liveMode === "all"
      ? strategies
      : strategies.filter((s) => s.liveMode === liveMode);

  return (
    <div className="py-section md:py-section-lg">
      <div className="max-w-content mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-text-dark dark:text-text-title mb-4">
          Performance Dashboard
        </h1>
        <p className="text-text-dark/70 dark:text-text/70 mb-10 max-w-2xl">
          전략별 목표·상태·성과 요약. 실거래/페이퍼 구분.
        </p>

        <div className="flex gap-2 mb-10">
          {(["all", "paper", "live"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setLiveMode(mode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                liveMode === mode
                  ? "bg-accent-blue text-white"
                  : "border border-border dark:border-border hover:bg-surface-light dark:hover:bg-surface/50"
              }`}
            >
              {mode === "all" ? "전체" : mode === "paper" ? "페이퍼" : "실거래"}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="p-6 rounded-xl border border-border dark:border-border bg-surface-light dark:bg-surface/30"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-text-dark dark:text-text-title">
                  {s.name}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    s.regimeStatus === "ON"
                      ? "bg-accent-green/20 text-accent-green"
                      : "bg-border/50 text-text-dark/60 dark:text-text/60"
                  }`}
                >
                  {s.regimeStatus}
                </span>
              </div>
              <p className="text-sm text-text-dark/70 dark:text-text/70 mb-4">
                {s.objective}
              </p>
              <div className="flex gap-4 text-sm">
                <span>MDD: {s.metrics.mdd}%</span>
                <span>Sharpe: {s.metrics.sharpe}</span>
                <span>턴오버: {s.metrics.turnover}%</span>
              </div>
              <span
                className={`inline-block mt-2 text-xs ${
                  s.liveMode === "live"
                    ? "text-accent-green"
                    : "text-text-dark/60 dark:text-text/60"
                }`}
              >
                {s.liveMode === "live" ? "실거래" : "페이퍼"}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-xl border border-border dark:border-border bg-surface-light dark:bg-surface/20">
          <h2 className="text-xl font-semibold text-text-dark dark:text-text-title mb-4">
            차트 (Placeholder)
          </h2>
          <p className="text-sm text-text-dark/70 dark:text-text/70">
            누적수익, 드로다운, 월별 수익 분포 등 차트는 추후 구현 예정.
          </p>
          <div className="mt-6 h-48 rounded-lg bg-border/20 dark:bg-border/10 flex items-center justify-center text-text-dark/50 dark:text-text/50">
            Chart area
          </div>
        </div>
      </div>
    </div>
  );
}
