export const MARKET_CATEGORIES = {
  equity: {
    label: "주식",
    indices: [
      { symbol: "^GSPC", name: "S&P 500", region: "US", currency: "USD" },
      { symbol: "^IXIC", name: "나스닥", region: "US", currency: "USD" },
      { symbol: "^DJI", name: "다우존스", region: "US", currency: "USD" },
      { symbol: "^RUT", name: "Russell 2000", region: "US", currency: "USD" },
      { symbol: "^KS11", name: "KOSPI", region: "KR", currency: "KRW" },
      { symbol: "^KQ11", name: "KOSDAQ", region: "KR", currency: "KRW" },
      { symbol: "^N225", name: "닛케이 225", region: "JP", currency: "JPY" },
      { symbol: "^HSI", name: "항셍", region: "HK", currency: "HKD" },
      { symbol: "000001.SS", name: "상하이 종합", region: "CN", currency: "CNY" },
      { symbol: "^FTSE", name: "FTSE 100", region: "UK", currency: "GBP" },
      { symbol: "^GDAXI", name: "DAX", region: "DE", currency: "EUR" },
      { symbol: "^FCHI", name: "CAC 40", region: "FR", currency: "EUR" },
    ],
  },
  commodity: {
    label: "원자재",
    indices: [
      { symbol: "CL=F", name: "WTI 원유", region: "US", currency: "USD" },
      { symbol: "GC=F", name: "금", region: "US", currency: "USD" },
      { symbol: "SI=F", name: "은", region: "US", currency: "USD" },
      { symbol: "HG=F", name: "구리", region: "US", currency: "USD" },
      { symbol: "NG=F", name: "천연가스", region: "US", currency: "USD" },
      { symbol: "ZW=F", name: "밀", region: "US", currency: "USD" },
    ],
  },
  bond: {
    label: "채권",
    indices: [
      { symbol: "^TNX", name: "미 10년물", region: "US", currency: "USD" },
      { symbol: "^IRX", name: "미 2년물", region: "US", currency: "USD" },
      { symbol: "DE10", name: "독일 10년", region: "DE", currency: "EUR" },
      { symbol: "JP10", name: "일본 10년", region: "JP", currency: "JPY" },
      { symbol: "KR10", name: "한국 10년", region: "KR", currency: "KRW" },
    ],
  },
  crypto: {
    label: "크립토",
    indices: [
      { symbol: "BTC-USD", name: "비트코인", region: "GLOBAL", currency: "USD" },
      { symbol: "ETH-USD", name: "이더리움", region: "GLOBAL", currency: "USD" },
      { symbol: "SOL-USD", name: "솔라나", region: "GLOBAL", currency: "USD" },
      { symbol: "XRP-USD", name: "XRP", region: "GLOBAL", currency: "USD" },
      { symbol: "BNB-USD", name: "BNB", region: "GLOBAL", currency: "USD" },
    ],
  },
  realestate: {
    label: "부동산",
    indices: [
      { symbol: "VNQ", name: "VNQ (US REIT)", region: "US", currency: "USD" },
      { symbol: "IYR", name: "IYR (US 부동산)", region: "US", currency: "USD" },
      { symbol: "REM", name: "REM (모기지)", region: "US", currency: "USD" },
      { symbol: "8952.T", name: "도쿄 REIT", region: "JP", currency: "JPY" },
    ],
  },
} as const;

export const MACRO_INDICES = [
  { symbol: "^VIX", name: "VIX (공포지수)", region: "US" },
  { symbol: "DX-Y.NYB", name: "달러 인덱스 (DXY)", region: "US" },
] as const;

export const COLORS = {
  up: "#1D9E75",
  down: "#D85A30",
} as const;
