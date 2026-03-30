const investingCards = [
  {
    label: "Framework",
    title: "자산 배분 원칙",
    summary:
      "장기 복리와 리스크 관리를 기준으로 포트폴리오 사고방식을 정리합니다.",
  },
  {
    label: "Notes",
    title: "기업과 산업 메모",
    summary:
      "관심 기업, 산업 구조, 경쟁 우위를 장기 투자 관점으로 기록합니다.",
  },
  {
    label: "Archive",
    title: "의사결정 로그",
    summary:
      "왜 보유했고 왜 팔았는지, 판단 근거를 축적하는 투자 아카이브입니다.",
  },
];

export default function InvestingPage() {
  return (
    <div className="terminal-container space-y-4">
      <section className="terminal-card p-6 md:p-8">
        <div className="terminal-label mb-3">Capital Journal</div>
        <h1 className="terminal-title text-4xl text-text-title md:text-5xl">
          Investing
        </h1>
        <p className="terminal-copy mt-4 max-w-3xl text-sm md:text-base">
          트레이딩보다 긴 호흡으로 자산 배분, 기업 분석, 의사결정 기록을 쌓는
          투자 섹션입니다.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {investingCards.map((card) => (
          <div key={card.title} className="terminal-card p-6">
            <div className="terminal-label mb-3">{card.label}</div>
            <h2 className="terminal-heading text-2xl text-text-title">
              {card.title}
            </h2>
            <p className="terminal-copy mt-3 text-sm">{card.summary}</p>
          </div>
        ))}
      </section>

      <section className="terminal-card p-6 md:p-8">
        <div className="terminal-label mb-3">Long Horizon</div>
        <h2 className="terminal-heading text-3xl text-text-title">
          긴 시간축을 위한 투자 메모 구조
        </h2>
        <p className="terminal-copy mt-3 max-w-2xl text-sm">
          당장 매매보다 보유 논리와 자본 배분 감각을 축적하는 데 초점을 둔
          페이지로 확장할 수 있게 구성했습니다.
        </p>
      </section>
    </div>
  );
}
