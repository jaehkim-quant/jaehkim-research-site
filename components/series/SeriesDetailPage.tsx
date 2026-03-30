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
  초급: "beginner",
  중급: "intermediate",
  고급: "advanced",
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

  return (
    <div className="terminal-container space-y-4">
      <Link
        href={basePath}
        className="terminal-label inline-flex items-center gap-2 text-[0.66rem] text-accent-orange hover:text-accent-orange/80"
      >
        ← {t(`${prefix}.backTo`)}
      </Link>

      <section className="terminal-card p-6 md:p-8">
        <div className="terminal-label mb-3">Series Detail</div>
        <h1 className="terminal-title text-4xl text-text-title md:text-5xl">
          {series.title}
        </h1>
        {series.description && (
          <p className="terminal-copy mt-4 max-w-3xl text-sm md:text-base">
            {series.description}
          </p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="terminal-badge terminal-badge-neutral">
            {t(`levels.${levelKeyMap[series.level] ?? "intermediate"}`)}
          </span>
          <span className="terminal-badge terminal-badge-blue">
            {series.posts.length} {t(`${prefix}.chapters`)}
          </span>
        </div>
      </section>

      {series.posts.length === 0 ? (
        <div className="terminal-card px-6 py-16 text-center text-text-dark">
          {t("research.noResults")}
        </div>
      ) : (
        <section className="grid gap-3">
          {series.posts.map((post, idx) => {
            const title = getPostTitle(post);
            const summary = getPostSummary(post);
            const tags = getPostTags(post);
            const chapterNum = post.seriesOrder ?? idx + 1;

            return (
              <Link
                key={post.id}
                href={`/research/${post.slug}`}
                className="terminal-list-row block px-5 py-5"
              >
                <div className="grid gap-4 md:grid-cols-[84px_minmax(0,1fr)_120px] md:items-start">
                  <div className="terminal-surface flex h-14 w-14 items-center justify-center rounded-sm">
                    <span className="terminal-number text-sm text-accent-orange">
                      {t(`${prefix}.chapter`)}
                      {chapterNum}
                    </span>
                  </div>

                  <div>
                    <h2 className="terminal-heading text-2xl text-text-title">
                      {title}
                    </h2>
                    <p className="terminal-copy mt-2 line-clamp-2 text-sm">
                      {summary}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="terminal-badge terminal-badge-amber">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 text-[0.7rem] text-text-dark md:flex-col md:items-end">
                    <span className="terminal-label text-[0.58rem]">
                      {post.viewCount ?? 0} {t("research.views")}
                    </span>
                    <span className="terminal-label text-[0.58rem]">
                      ♥ {post.likeCount ?? 0}
                    </span>
                    <span className="terminal-label text-[0.58rem]">
                      💬 {post.commentCount ?? 0}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
}
