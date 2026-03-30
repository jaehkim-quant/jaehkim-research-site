import { MARKET_CATEGORIES } from "@/lib/market/constants";
import { IndexTable } from "./_components/IndexTable";
import { MarketSubTabs } from "./_components/MarketSubTabs";
import { PerformanceBar } from "./_components/PerformanceBar";
import { PlaceholderView } from "./_components/Placeholders";
import { SparklineChart } from "./_components/SparklineChart";
import { SummaryCards } from "./_components/SummaryCards";
import { getMarketRowsByAsset } from "./_components/mock/marketData";
import {
  MARKET_VIEW_OPTIONS,
  PERIOD_LABELS,
  normalizeMarketMonitorState,
} from "./_components/marketMonitorState";

export default function MarketMonitorPage({
  searchParams = {},
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const state = normalizeMarketMonitorState(searchParams);

  if (state.view !== "daily") {
    return <PlaceholderView view={state.view} />;
  }

  const rows = getMarketRowsByAsset(state.asset);
  const selectedRow = rows.find((row) => row.symbol === state.symbol) ?? rows[0];
  const activeViewLabel =
    MARKET_VIEW_OPTIONS.find((option) => option.id === state.view)?.label ?? "Daily Markets";

  return (
    <div className="space-y-4">
      <section className="terminal-card p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="terminal-label mb-3">{activeViewLabel}</div>
            <h1 className="terminal-title text-4xl text-text-title md:text-5xl">
              Market Monitor
            </h1>
            <p className="terminal-copy mt-4 max-w-3xl text-sm md:text-base">
              자산군별 흐름과 주요 지수의 기간별 성과를 한 화면에서 빠르게 읽을 수
              있도록 구성한 시장 모니터 워크스페이스입니다.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="terminal-surface rounded-sm p-4">
              <div className="terminal-label text-[0.62rem]">Asset</div>
              <div className="terminal-number mt-2 text-lg text-text-title">
                {MARKET_CATEGORIES[state.asset].label}
              </div>
            </div>
            <div className="terminal-surface rounded-sm p-4">
              <div className="terminal-label text-[0.62rem]">Selected</div>
              <div className="terminal-number mt-2 text-lg text-text-title">
                {selectedRow.symbol}
              </div>
            </div>
            <div className="terminal-surface rounded-sm p-4">
              <div className="terminal-label text-[0.62rem]">Sort Window</div>
              <div className="terminal-number mt-2 text-lg text-accent-orange">
                {PERIOD_LABELS[state.period]}
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketSubTabs state={state} />
      <SummaryCards row={selectedRow} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <IndexTable rows={rows} state={state} />
        <div className="grid gap-4">
          <SparklineChart row={selectedRow} period={state.period} />
          <PerformanceBar asset={state.asset} rows={rows} />
        </div>
      </div>
    </div>
  );
}
