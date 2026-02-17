// Post (Research)
export type Level = "초급" | "중급" | "고급";

export interface Assumptions {
  dataRange: string;
  universe: string;
  rebalance: string;
  costs: string;
  slippage: string;
  execution: string;
}

export interface Metrics {
  cagr?: number;
  mdd: number;
  sharpe?: number;
  sortino?: number;
  calmar?: number;
  turnover?: number;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  deepDive?: string;
  content?: string;
  contentEn?: string;
  tags: string[];
  level: Level;
  date: string;
  updatedAt?: string;
  published?: boolean;
  assumptions?: Assumptions;
  metrics?: Metrics;
  /** English content for locale "en" */
  titleEn?: string;
  summaryEn?: string;
  tagsEn?: string[];
}

// Strategy
export type RegimeStatus = "ON" | "OFF";
export type LiveMode = "paper" | "live";

export interface Strategy {
  id: string;
  name: string;
  objective: string;
  regimeStatus: RegimeStatus;
  liveMode: LiveMode;
  metrics: Partial<Metrics>;
  chartsData?: Record<string, number[]>;
}

// Case Study
export interface CaseStudy {
  id: string;
  title: string;
  problem: string;
  approach: string;
  result: string;
  learnings: string;
  next: string;
  slug: string;
  date?: string;
}
