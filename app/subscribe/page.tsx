"use client";

import { useState } from "react";

const tiers = [
  {
    name: "Free",
    price: "0",
    features: ["리서치 요약 접근", "뉴스레터 구독", "기본 아카이브"],
  },
  {
    name: "Pro",
    price: "월 9",
    featured: true,
    features: [
      "전체 리서치 Deep Dive",
      "전략 템플릿 다운로드",
      "분기 성과 리포트",
      "우선 Q&A",
    ],
  },
  {
    name: "Enterprise",
    price: "문의",
    features: [
      "맞춤 자문·협업",
      "온사이트 워크숍",
      "전략 검증 서비스",
      "SLA 지원",
    ],
  },
];

export default function SubscribePage() {
  const [formPurpose, setFormPurpose] = useState("");
  const [formBudget, setFormBudget] = useState("");
  const [formPeriod, setFormPeriod] = useState("");
  const [formGoal, setFormGoal] = useState("");

  return (
    <div className="terminal-container space-y-4">
      <section className="terminal-card p-6 md:p-8">
        <div className="terminal-label mb-3">Subscription Terminal</div>
        <h1 className="terminal-title text-4xl text-text-title md:text-5xl">
          Subscribe / Work With Me
        </h1>
        <p className="terminal-copy mt-4 max-w-3xl text-sm md:text-base">
          뉴스레터와 협업 제안을 위한 가격·문의 패널입니다.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={
              tier.featured
                ? "rounded-sm bg-accent-orange p-6 text-[#2c1700] shadow-terminal"
                : "terminal-card p-6"
            }
          >
            <div className={`terminal-label ${tier.featured ? "text-[#7a4100]" : ""}`}>
              {tier.featured ? "Featured Tier" : "Access Tier"}
            </div>
            <h2
              className={`mt-3 text-3xl font-black tracking-tight ${tier.featured ? "text-[#2c1700]" : "terminal-heading text-text-title"}`}
            >
              {tier.name}
            </h2>
            <p className={`mt-2 text-2xl font-semibold ${tier.featured ? "text-[#2c1700]" : "text-accent-orange"}`}>
              ${tier.price}
            </p>
            <div className="mt-6 space-y-3">
              {tier.features.map((feature) => (
                <div
                  key={feature}
                  className={`rounded-sm px-3 py-3 text-sm ${tier.featured ? "bg-black/10 text-[#5c3200]" : "bg-white/5 text-text-dark"}`}
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="terminal-card p-6 md:p-8">
          <div className="terminal-label mb-4">Custom Engagement</div>
          <form className="space-y-5">
            <div>
              <label className="terminal-label mb-2 block text-[0.66rem]">목적</label>
              <select
                value={formPurpose}
                onChange={(e) => setFormPurpose(e.target.value)}
                className="terminal-select"
              >
                <option value="">선택</option>
                <option value="투자">투자</option>
                <option value="협업">협업</option>
                <option value="강연">강연</option>
                <option value="채용">채용</option>
              </select>
            </div>
            <div>
              <label className="terminal-label mb-2 block text-[0.66rem]">
                예산 (선택)
              </label>
              <input
                type="text"
                value={formBudget}
                onChange={(e) => setFormBudget(e.target.value)}
                placeholder="예: $5K ~ $10K"
                className="terminal-input"
              />
            </div>
            <div>
              <label className="terminal-label mb-2 block text-[0.66rem]">기간</label>
              <input
                type="text"
                value={formPeriod}
                onChange={(e) => setFormPeriod(e.target.value)}
                placeholder="예: 3개월, 1년"
                className="terminal-input"
              />
            </div>
            <div>
              <label className="terminal-label mb-2 block text-[0.66rem]">목표</label>
              <textarea
                value={formGoal}
                onChange={(e) => setFormGoal(e.target.value)}
                rows={4}
                placeholder="달성하고 싶은 목표를 간단히 적어주세요."
                className="terminal-textarea"
              />
            </div>
            <button
              type="submit"
              className="terminal-primary-button font-label text-xs uppercase tracking-[0.22em]"
            >
              문의 보내기
            </button>
          </form>
        </section>

        <aside className="grid gap-4">
          <div className="terminal-card p-5">
            <div className="terminal-label mb-3">Morning Alpha</div>
            <p className="terminal-copy text-sm">
              Daily intelligence, delivered before the bell. Includes fresh research, archive highlights, and active operating notes.
            </p>
          </div>
          <div className="terminal-card p-5">
            <div className="terminal-label mb-3">Ad Inventory</div>
            <div className="h-24 rounded-sm border border-border bg-white/4" />
          </div>
        </aside>
      </div>
    </div>
  );
}
