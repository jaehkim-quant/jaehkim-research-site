import Link from "next/link";
import { casesMock } from "@/lib/research/data/cases.mock";

export default function CaseStudiesPage() {
  return (
    <div className="py-section md:py-section-lg">
      <div className="max-w-content mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-text-dark dark:text-text-title mb-4">
          Case Studies
        </h1>
        <p className="text-text-dark/70 dark:text-text/70 mb-12 max-w-2xl">
          Problem → Approach → Result → Learnings → Next 템플릿으로 정리된
          사례입니다.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {casesMock.map((c) => (
            <Link
              key={c.id}
              href={`/case-studies/${c.slug}`}
              className="block p-6 rounded-xl border border-border dark:border-border bg-surface-light dark:bg-surface/30 hover:bg-surface-light/80 dark:hover:bg-surface/50 transition-colors"
            >
              <h3 className="font-semibold text-text-dark dark:text-text-title mb-2">
                {c.title}
              </h3>
              <p className="text-sm text-text-dark/70 dark:text-text/70 line-clamp-2 mb-3">
                {c.problem}
              </p>
              <span className="text-xs text-text-dark/60 dark:text-text/60">
                {c.date}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
