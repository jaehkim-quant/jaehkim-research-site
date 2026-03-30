import Link from "next/link";
import { casesMock } from "@/lib/research/data/cases.mock";

export default function CaseStudiesPage() {
  return (
    <div className="terminal-container space-y-4">
      <section className="terminal-card p-6 md:p-8">
        <div className="terminal-label mb-3">Case File Archive</div>
        <h1 className="terminal-title text-4xl text-text-title md:text-5xl">
          Case Studies
        </h1>
        <p className="terminal-copy mt-4 max-w-3xl text-sm md:text-base">
          Problem → Approach → Result → Learnings → Next 구조로 정리된 실행 사례 아카이브입니다.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {casesMock.map((c) => (
          <Link
            key={c.id}
            href={`/case-studies/${c.slug}`}
            className="terminal-card block p-6 hover:-translate-y-1"
          >
            <div className="terminal-label mb-3">{c.date}</div>
            <h2 className="terminal-heading text-2xl text-text-title">
              {c.title}
            </h2>
            <p className="terminal-copy mt-3 line-clamp-3 text-sm">
              {c.problem}
            </p>
            <div className="mt-6 flex items-center justify-between">
              <span className="terminal-label text-[0.62rem] text-accent-orange">
                Open case file
              </span>
              <span className="terminal-number text-sm text-text-title">↗</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
