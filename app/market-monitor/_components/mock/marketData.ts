import { MARKET_CATEGORIES } from "@/lib/market/constants";
import type { MarketAssetKey } from "../marketMonitorState";

export interface MarketMetricRow {
  symbol: string;
  name: string;
  region: string;
  currency: string;
  price: number;
  d: number;
  w: number;
  m: number;
  ytd: number;
  y: number;
  sparkline: number[];
}

const PRICE_BASES: Record<MarketAssetKey, number[]> = {
  equity: [
    5820.8,
    18845.2,
    42433.5,
    2718.4,
    881.2,
    40212.3,
    17291.5,
    18602.8,
    3221.9,
    8133.2,
    18420.7,
    8211.4,
  ],
  commodity: [78.5, 2311.8, 26.9, 4.36, 2.12, 575.3],
  bond: [4.24, 3.91, 2.43, 1.14, 3.18],
  crypto: [82340, 4310, 188.4, 0.63, 611.7],
  realestate: [91.6, 87.9, 23.4, 1724.5],
};

const CATEGORY_PROFILES: Record<
  MarketAssetKey,
  {
    dailyBase: number;
    weeklyBase: number;
    monthlyBase: number;
    ytdBase: number;
    yearlyBase: number;
    sparkVolatility: number;
    sparkDrift: number;
  }
> = {
  equity: {
    dailyBase: 0.42,
    weeklyBase: 1.35,
    monthlyBase: 3.8,
    ytdBase: 8.4,
    yearlyBase: 16.2,
    sparkVolatility: 0.013,
    sparkDrift: 0.028,
  },
  commodity: {
    dailyBase: 0.68,
    weeklyBase: 1.8,
    monthlyBase: 4.9,
    ytdBase: 9.1,
    yearlyBase: 13.5,
    sparkVolatility: 0.019,
    sparkDrift: 0.035,
  },
  bond: {
    dailyBase: 0.11,
    weeklyBase: 0.36,
    monthlyBase: 0.92,
    ytdBase: 2.6,
    yearlyBase: 4.4,
    sparkVolatility: 0.005,
    sparkDrift: 0.012,
  },
  crypto: {
    dailyBase: 1.12,
    weeklyBase: 3.4,
    monthlyBase: 9.8,
    ytdBase: 16.4,
    yearlyBase: 28.5,
    sparkVolatility: 0.028,
    sparkDrift: 0.052,
  },
  realestate: {
    dailyBase: 0.27,
    weeklyBase: 0.92,
    monthlyBase: 2.8,
    ytdBase: 6.3,
    yearlyBase: 10.4,
    sparkVolatility: 0.01,
    sparkDrift: 0.02,
  },
};

function round(value: number, digits = 2) {
  return Number(value.toFixed(digits));
}

function createSignedMetric(base: number, seed: number, magnitude = 0.18) {
  const sign = seed % 5 === 0 || seed % 7 === 0 ? -1 : 1;
  const value = base + (seed % 4) * magnitude;
  return round(sign * value);
}

function createSparkline(
  basePrice: number,
  seed: number,
  asset: MarketAssetKey,
): number[] {
  const profile = CATEGORY_PROFILES[asset];

  return Array.from({ length: 24 }, (_, index) => {
    const progress = index / 23 - 0.5;
    const drift = basePrice * profile.sparkDrift * progress;
    const waveA =
      Math.sin((index + seed * 0.85) * 0.55) *
      basePrice *
      profile.sparkVolatility;
    const waveB =
      Math.cos((index + seed * 0.35) * 0.3) *
      basePrice *
      profile.sparkVolatility *
      0.55;

    return round(Math.max(basePrice * 0.45, basePrice + drift + waveA + waveB));
  });
}

function buildMetricRow(
  asset: MarketAssetKey,
  index: number,
  basePrice: number,
  symbol: string,
  name: string,
  region: string,
  currency: string,
): MarketMetricRow {
  const seed = index + asset.length * 3;
  const profile = CATEGORY_PROFILES[asset];
  const sparkline = createSparkline(basePrice, seed, asset);

  return {
    symbol,
    name,
    region,
    currency,
    price: sparkline[sparkline.length - 1],
    d: createSignedMetric(profile.dailyBase, seed, 0.14),
    w: createSignedMetric(profile.weeklyBase, seed + 1, 0.28),
    m: createSignedMetric(profile.monthlyBase, seed + 2, 0.56),
    ytd: createSignedMetric(profile.ytdBase, seed + 3, 1.1),
    y: createSignedMetric(profile.yearlyBase, seed + 4, 1.6),
    sparkline,
  };
}

const marketDataByAsset = Object.fromEntries(
  (Object.entries(MARKET_CATEGORIES) as Array<
    [MarketAssetKey, (typeof MARKET_CATEGORIES)[MarketAssetKey]]
  >).map(([asset, category]) => [
    asset,
    category.indices.map((item, index) =>
      buildMetricRow(
        asset,
        index,
        PRICE_BASES[asset][index],
        item.symbol,
        item.name,
        item.region,
        item.currency,
      ),
    ),
  ]),
) as Record<MarketAssetKey, MarketMetricRow[]>;

export function getMarketRowsByAsset(asset: MarketAssetKey) {
  return marketDataByAsset[asset];
}
