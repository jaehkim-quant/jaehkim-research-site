import { MARKET_CATEGORIES } from "@/lib/market/constants";

export type MarketAssetKey = keyof typeof MARKET_CATEGORIES;
export type PeriodKey = "d" | "w" | "m" | "ytd" | "y";
export type MarketView = "daily" | "regime" | "relative-strength";

export interface MarketMonitorState {
  view: MarketView;
  asset: MarketAssetKey;
  period: PeriodKey;
  symbol: string;
}

export const MARKET_VIEW_OPTIONS: Array<{ id: MarketView; label: string }> = [
  { id: "daily", label: "Daily Markets" },
  { id: "regime", label: "시장 국면" },
  { id: "relative-strength", label: "상대강도 분석" },
];

export const PERIOD_OPTIONS: PeriodKey[] = ["d", "w", "m", "ytd", "y"];

export const PERIOD_LABELS: Record<PeriodKey, string> = {
  d: "1D",
  w: "1W",
  m: "1M",
  ytd: "YTD",
  y: "1Y",
};

export const MARKET_ASSET_KEYS = Object.keys(
  MARKET_CATEGORIES,
) as MarketAssetKey[];

const DEFAULT_VIEW: MarketView = "daily";
const DEFAULT_ASSET: MarketAssetKey = "equity";
const DEFAULT_PERIOD: PeriodKey = "d";

function getFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isView(value: string | undefined): value is MarketView {
  return MARKET_VIEW_OPTIONS.some((option) => option.id === value);
}

function isAsset(value: string | undefined): value is MarketAssetKey {
  return MARKET_ASSET_KEYS.includes(value as MarketAssetKey);
}

function isPeriod(value: string | undefined): value is PeriodKey {
  return PERIOD_OPTIONS.includes(value as PeriodKey);
}

export function normalizeMarketMonitorState(
  searchParams: Record<string, string | string[] | undefined>,
): MarketMonitorState {
  const viewCandidate = getFirstValue(searchParams.view);
  const assetCandidate = getFirstValue(searchParams.asset);
  const periodCandidate = getFirstValue(searchParams.period);
  const symbolCandidate = getFirstValue(searchParams.symbol);

  const view = isView(viewCandidate) ? viewCandidate : DEFAULT_VIEW;
  const asset = isAsset(assetCandidate) ? assetCandidate : DEFAULT_ASSET;
  const period = isPeriod(periodCandidate) ? periodCandidate : DEFAULT_PERIOD;
  const validSymbols = MARKET_CATEGORIES[asset].indices.map(
    (item) => item.symbol,
  ) as string[];
  const symbol =
    symbolCandidate && validSymbols.includes(symbolCandidate)
      ? symbolCandidate
      : validSymbols[0];

  return { view, asset, period, symbol };
}

export function buildMarketMonitorHref(
  currentState: MarketMonitorState,
  updates: Partial<MarketMonitorState> = {},
) {
  const nextState = { ...currentState, ...updates };
  const validSymbols = MARKET_CATEGORIES[nextState.asset].indices.map(
    (item) => item.symbol,
  ) as string[];

  if (!validSymbols.includes(nextState.symbol)) {
    nextState.symbol = validSymbols[0];
  }

  const params = new URLSearchParams();
  params.set("view", nextState.view);
  params.set("asset", nextState.asset);
  params.set("period", nextState.period);
  params.set("symbol", nextState.symbol);

  return `/market-monitor?${params.toString()}`;
}
