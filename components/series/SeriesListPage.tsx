"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { Series } from "@/lib/research/types";

const levelKeyMap: Record<string, string> = {
  초급: "beginner",
  중급: "intermediate",
  고급: "advanced",
};

interface SeriesListPageProps {
  initialData: Series[];
  basePath: string;
  translationPrefix: string;
}

export function SeriesListPage({
  initialData,
  basePath,
  translationPrefix,
}: SeriesListPageProps) {
  const { t } = useTranslation();
  const prefix = translationPrefix;

  return (
    <div className="terminal-container space-y-4">
      <section className="terminal-card p-6 md:p-8">
        <div className="terminal-label mb-3">Series Terminal</div>
        <h1 className="terminal-title text-4xl text-text-title md:text-5xl">
          {t(`${prefix}.title`)}
        </h1>
        <p className="terminal-copy mt-4 max-w-3xl text-sm md:text-base">
          {t(`${prefix}.desc`)}
        </p>
      </section>

      {initialData.length === 0 ? (
        <div className="terminal-card px-6 py-16 text-center text-text-dark">
          {t(`${prefix}.noSeries`)}
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {initialData.map((series) => {
            const levelKey = levelKeyMap[series.level] ?? "intermediate";

            return (
              <Link
                key={series.id}
                href={`${basePath}/${series.slug}`}
                className="terminal-card group block p-6 hover:-translate-y-1"
              >
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="terminal-badge terminal-badge-neutral">
                    {t(`levels.${levelKey}`)}
                  </span>
                  <span className="terminal-badge terminal-badge-blue">
                    {series.postCount ?? 0} {t(`${prefix}.posts`)}
                  </span>
                </div>

                <h2 className="terminal-heading text-2xl text-text-title group-hover:text-accent-orange">
                  {series.title}
                </h2>

                {series.description && (
                  <p className="terminal-copy mt-3 line-clamp-3 text-sm">
                    {series.description}
                  </p>
                )}

                <div className="mt-6 flex items-center justify-between">
                  <span className="terminal-label text-[0.62rem] text-accent-orange">
                    {t(`${prefix}.viewSeries`)}
                  </span>
                  <span className="terminal-number text-sm text-text-title">↗</span>
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
}
