"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { Series } from "@/lib/research/types";

const levelKeyMap: Record<string, string> = {
  "초급": "beginner",
  "중급": "intermediate",
  "고급": "advanced",
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
  const { t, locale } = useTranslation();

  const getTitle = (s: Series) =>
    locale === "en" && s.titleEn ? s.titleEn : s.title;
  const getDesc = (s: Series) =>
    locale === "en" && s.descriptionEn ? s.descriptionEn : s.description;

  const prefix = translationPrefix;

  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="max-w-content mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
          {t(`${prefix}.title`)}
        </h1>
        <p className="text-slate-600 mb-10 max-w-2xl">{t(`${prefix}.desc`)}</p>

        {initialData.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            {t(`${prefix}.noSeries`)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialData.map((series) => {
              const levelKey = levelKeyMap[series.level] ?? "intermediate";
              return (
                <Link
                  key={series.id}
                  href={`${basePath}/${series.slug}`}
                  className="group block rounded-xl border border-slate-200 bg-white p-6 hover:border-accent-orange/50 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {t(`levels.${levelKey}`)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {series.postCount ?? 0} {t(`${prefix}.posts`)}
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-accent-orange transition-colors">
                    {getTitle(series)}
                  </h2>

                  {getDesc(series) && (
                    <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                      {getDesc(series)}
                    </p>
                  )}

                  <span className="text-sm font-medium text-accent-orange group-hover:underline">
                    {t(`${prefix}.viewSeries`)} →
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
