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
    <div className="py-section md:py-section-lg">
      <div className="max-w-content mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-text-dark dark:text-text-title mb-4">
          Subscribe / Work With Me
        </h1>
        <p className="text-text-dark/70 dark:text-text/70 mb-16 max-w-2xl">
          3단 가격표와 협업·자문 문의 폼입니다.
        </p>

        <section className="mb-24">
          <h2 className="text-2xl font-semibold text-text-dark dark:text-text-title mb-10">
            가격
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`p-8 rounded-2xl border ${
                  tier.featured
                    ? "border-accent-blue bg-accent-blue/5 dark:bg-accent-blue/10"
                    : "border-border dark:border-border bg-surface-light dark:bg-surface/30"
                }`}
              >
                {tier.featured && (
                  <span className="text-xs font-medium text-accent-blue mb-4 block">
                    인기
                  </span>
                )}
                <h3 className="text-xl font-semibold text-text-dark dark:text-text-title mb-2">
                  {tier.name}
                </h3>
                <p className="text-2xl font-bold text-accent-blue mb-6">
                  ${tier.price}
                </p>
                <ul className="space-y-3">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="text-sm text-text-dark/80 dark:text-text/80 flex items-center gap-2"
                    >
                      <span className="text-accent-blue">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="rounded-xl border border-border dark:border-border bg-surface-light/30 dark:bg-surface/20 h-24 flex items-center justify-center text-text-dark/50 dark:text-text/50 text-sm">
            광고 슬롯 (레이아웃만)
          </div>
        </section>

        <section id="contact">
          <h2 className="text-2xl font-semibold text-text-dark dark:text-text-title mb-6">
            문의
          </h2>
          <form className="max-w-xl space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text mb-2">
                목적
              </label>
              <select
                value={formPurpose}
                onChange={(e) => setFormPurpose(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border dark:border-border bg-surface-light dark:bg-surface/50 text-text-dark dark:text-text focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
              >
                <option value="">선택</option>
                <option value="투자">투자</option>
                <option value="협업">협업</option>
                <option value="강연">강연</option>
                <option value="채용">채용</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text mb-2">
                예산 (선택)
              </label>
              <input
                type="text"
                value={formBudget}
                onChange={(e) => setFormBudget(e.target.value)}
                placeholder="예: $5K ~ $10K"
                className="w-full px-4 py-3 rounded-lg border border-border dark:border-border bg-surface-light dark:bg-surface/50 text-text-dark dark:text-text placeholder:text-text-dark/50 dark:placeholder:text-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text mb-2">
                기간
              </label>
              <input
                type="text"
                value={formPeriod}
                onChange={(e) => setFormPeriod(e.target.value)}
                placeholder="예: 3개월, 1년"
                className="w-full px-4 py-3 rounded-lg border border-border dark:border-border bg-surface-light dark:bg-surface/50 text-text-dark dark:text-text placeholder:text-text-dark/50 dark:placeholder:text-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text mb-2">
                목표
              </label>
              <textarea
                value={formGoal}
                onChange={(e) => setFormGoal(e.target.value)}
                rows={4}
                placeholder="달성하고 싶은 목표를 간단히 적어주세요."
                className="w-full px-4 py-3 rounded-lg border border-border dark:border-border bg-surface-light dark:bg-surface/50 text-text-dark dark:text-text placeholder:text-text-dark/50 dark:placeholder:text-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 resize-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-accent-blue text-white font-medium hover:bg-accent-blue/90 transition-colors"
            >
              문의 보내기
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
