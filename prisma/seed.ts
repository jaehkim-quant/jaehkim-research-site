import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const posts = [
  {
    title: "모멘텀 팩터의 레짐 의존성 분석",
    titleEn: "Momentum Factor Regime Dependence",
    slug: "momentum-regime",
    summary:
      "모멘텀 전략이 어떤 시장 레짐에서 유효한지, 아웃오브샘플 검증 결과를 공유합니다. 2000년대 이후 데이터를 기반으로 합니다.",
    summaryEn:
      "When momentum works across market regimes—out-of-sample validation. Based on data from the 2000s onward.",
    tags: ["팩터", "모멘텀", "레짐"],
    tagsEn: ["Factor", "Momentum", "Regime"],
    level: "고급",
    published: true,
    date: new Date("2024-01-15"),
  },
  {
    title: "볼atility Targeting 기초",
    titleEn: "Volatility Targeting Basics",
    slug: "vol-targeting-basics",
    summary:
      "변동성 목표 기반 포지션 스케일링의 원리와 구현. 백테스트 시 룩어헤드 방지, 수수료·슬리피지 가정을 어떻게 설정하는지 다룹니다.",
    summaryEn:
      "Position scaling by volatility target. How to set look-ahead-free backtest assumptions for fees and slippage.",
    tags: ["리스크", "볼타일리티", "초급"],
    tagsEn: ["Risk", "Volatility", "Beginner"],
    level: "초급",
    published: true,
    date: new Date("2024-01-10"),
  },
  {
    title: "크립토 시장 구조 리서치",
    titleEn: "Crypto Market Structure Research",
    slug: "crypto-market-structure",
    summary:
      "거래소 간 스프레드, 기관 유입에 따른 시장 구조 변화를 분석합니다. 24/7 데이터 처리 이슈도 다룹니다.",
    summaryEn:
      "Cross-exchange spreads and how structure changes with institutional flow. 24/7 data handling issues.",
    tags: ["크립토", "마켓구조"],
    tagsEn: ["Crypto", "Market Structure"],
    level: "중급",
    published: true,
    date: new Date("2024-01-05"),
  },
  {
    title: "파생상품 헤징 전략",
    titleEn: "Derivatives Hedging Strategies",
    slug: "derivatives-hedging",
    summary:
      "옵션/선물을 활용한 헤징 포트폴리오 구성. 델타 중립과 감마 노출 관리의 트레이드오프를 정리합니다.",
    summaryEn:
      "Building hedged portfolios with options and futures. Trade-offs between delta neutrality and gamma exposure.",
    tags: ["파생", "헤징", "리스크"],
    tagsEn: ["Derivatives", "Hedging", "Risk"],
    level: "고급",
    published: true,
    date: new Date("2023-12-20"),
  },
  {
    title: "매크로 레짐 스위칭 시그널",
    titleEn: "Macro Regime Switching Signals",
    slug: "macro-regime-signals",
    summary:
      "금리, 인플레이션, 실업률 기반 레짐 분류 및 전략 온/오프 스위치 적용. 워크포워드 검증 결과 포함.",
    summaryEn:
      "Regime classification from rates, inflation, unemployment and strategy on/off switches. Walk-forward results included.",
    tags: ["매크로레짐", "전략", "신호"],
    tagsEn: ["Macro Regime", "Strategy", "Signals"],
    level: "중급",
    published: true,
    date: new Date("2023-12-10"),
  },
  {
    title: "리밸런싱 주기 최적화",
    titleEn: "Rebalancing Frequency Optimization",
    slug: "rebalance-frequency",
    summary:
      "일/주/월 리밸런싱의 비용·수익 트레이드오프. 턴오버와 MDD 관점에서 권장 설정을 제시합니다.",
    summaryEn:
      "Cost vs benefit of daily/weekly/monthly rebalancing. Suggested settings from turnover and MDD.",
    tags: ["전략", "비용", "최적화"],
    tagsEn: ["Strategy", "Costs", "Optimization"],
    level: "초급",
    published: true,
    date: new Date("2023-11-28"),
  },
];

async function main() {
  console.log("Seeding posts...");

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  console.log(`Seeded ${posts.length} posts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
