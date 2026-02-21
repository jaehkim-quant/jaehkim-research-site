"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { Series, Post } from "@/lib/research/types";
import {
  getPostTitle,
  getPostSummary,
  getPostTags,
} from "@/lib/research/postLocale";

const levelKeyMap: Record<string, string> = {
  "초급": "beginner",
  "중급": "intermediate",
  "고급": "advanced",
};

interface SeriesDetailPageProps {
  initialData: Series & { posts: Post[] };
  basePath: string;
  translationPrefix: string;
}

export function SeriesDetailPage({
  initialData: series,
  basePath,
  translationPrefix,
}: SeriesDetailPageProps) {
  const { t } = useTranslation();
  const prefix = translationPrefix;

  const seriesTitle = series.title;
  const seriesDesc = series.description;

  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="max-w-content mx-auto px-6">
        <Link
          href={basePath}
          className="text-sm text-accent-orange hover:underline mb-6 inline-block"
        >
          {t(`${prefix}.backTo`)}
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3">
            {seriesTitle}
          </h1>
          {seriesDesc && (
            <p className="text-slate-600 max-w-2xl">{seriesDesc}</p>
          )}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
              {t(`levels.${levelKeyMap[series.level] ?? "intermediate"}`)}
            </span>
            <span className="text-sm text-slate-500">
              {series.posts.length} {t(`${prefix}.chapters`)}
            </span>
          </div>
        </div>

        {series.posts.length === 0 ? (
          <p className="text-slate-500 py-8">{t("research.noResults")}</p>
        ) : (
          <div className="space-y-3">
            {series.posts.map((post, idx) => {
              const title = getPostTitle(post);
              const summary = getPostSummary(post);
              const tags = getPostTags(post);
              const chapterNum = post.seriesOrder ?? idx + 1;

              return (
                <Link
                  key={post.id}
                  href={`/research/${post.slug}`}
                  className="flex items-start gap-4 p-5 rounded-lg border border-slate-200 bg-white hover:border-accent-orange/50 hover:shadow-sm transition-all group"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-100 group-hover:bg-accent-orange/10 flex items-center justify-center transition-colors">
                    <span className="text-sm font-bold text-slate-500 group-hover:text-accent-orange transition-colors">
                      {t(`${prefix}.chapter`)}{chapterNum}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-slate-900 mb-1 group-hover:text-accent-orange transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                      {summary}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded bg-accent-orange/10 text-accent-orange font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0 text-xs text-slate-500">
                    {(post.viewCount ?? 0) > 0 && (
                      <span>
                        {post.viewCount} {t("research.views")}
                      </span>
                    )}
                    {(post.likeCount ?? 0) > 0 && <span>♥ {post.likeCount}</span>}
                    {(post.commentCount ?? 0) > 0 && (
                      <span>💬 {post.commentCount}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
