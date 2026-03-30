import { MARKET_VIEW_OPTIONS, type MarketView } from "./marketMonitorState";

interface PlaceholderViewProps {
  view: Exclude<MarketView, "daily">;
}

const placeholderContent: Record<
  Exclude<MarketView, "daily">,
  { title: string; description: string; slots: string[] }
> = {
  regime: {
    title: "시장 국면",
    description:
      "레짐 전환, 변동성 구간, 유동성 상태를 시계열로 읽는 섹션입니다. Phase 1에서는 화면 구조와 카드 슬롯만 먼저 확보합니다.",
    slots: ["Macro Regime Clock", "Liquidity Panel", "Volatility Window"],
  },
  "relative-strength": {
    title: "상대강도 분석",
    description:
      "자산군 간 상대 강도와 주도 섹터 흐름을 비교하는 섹션입니다. Phase 1에서는 정보 구조와 시각 레이아웃만 먼저 준비합니다.",
    slots: ["Cross-Asset Ranking", "Sector Rotation", "Leaders / Laggards"],
  },
};

export function PlaceholderView({ view }: PlaceholderViewProps) {
  const current = placeholderContent[view];
  const viewLabel =
    MARKET_VIEW_OPTIONS.find((option) => option.id === view)?.label ?? current.title;

  return (
    <div className="space-y-4">
      <section className="terminal-card p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="terminal-label mb-3">{viewLabel}</div>
            <h2 className="terminal-title text-4xl text-text-title md:text-5xl">
              {current.title}
            </h2>
            <p className="terminal-copy mt-4 max-w-3xl text-sm md:text-base">
              {current.description}
            </p>
          </div>
          <span className="terminal-badge terminal-badge-amber">Phase 2</span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {current.slots.map((slot) => (
          <div key={slot} className="terminal-card p-6">
            <div className="terminal-label mb-3">Reserved Slot</div>
            <h3 className="terminal-heading text-2xl text-text-title">{slot}</h3>
            <p className="terminal-copy mt-3 text-sm">
              데이터 연결 전 단계에서 카드 위치와 정보 밀도를 먼저 고정합니다.
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
