export type Period = "d" | "w" | "m" | "ytd" | "y";
export type MarketCategory =
  | "equity"
  | "commodity"
  | "bond"
  | "crypto"
  | "realestate";

export interface IndexQuote {
  symbol: string;
  name: string;
  region: string;
  currency: string;
  price: number;
  d: number;   // 일간 %
  w: number;   // 주간 %
  m: number;   // 월간 %
  ytd: number; // YTD %
  y: number;   // 1년 %
  updatedAt: string; // ISO 8601
}

export interface PricePoint {
  date: string; // "YYYY-MM-DD"
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
