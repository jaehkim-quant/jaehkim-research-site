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
  tags: string[];
  level: Level;
  date: string;
  updatedAt?: string;
  published?: boolean;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  assumptions?: Assumptions;
  metrics?: Metrics;
  seriesId?: string | null;
  seriesOrder?: number | null;
}

export interface Series {
  id: string;
  title: string;
  slug: string;
  description?: string;
  type: string;
  level: string;
  published?: boolean;
  createdAt: string;
  updatedAt: string;
  postCount?: number;
  posts?: Post[];
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
