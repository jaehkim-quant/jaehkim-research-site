"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getPostTitle, getPostSummary, getPostTags } from "@/lib/research/postLocale";
import type { Post } from "@/lib/research/types";

const levelKeyMap = {
  초급: "beginner",
  중급: "intermediate",
  고급: "advanced",
} as const;

interface ResearchCardProps {
  post: Post;
  variant?: "default" | "compact";
}

export function ResearchCard({ post, variant = "default" }: ResearchCardProps) {
  const { t, locale } = useTranslation();
  const levelKey = levelKeyMap[post.level] ?? "beginner";
  const title = getPostTitle(post, locale);
  const summary = getPostSummary(post, locale);
  const tags = getPostTags(post, locale);

  return (
    <Link
      href={`/research/${post.slug}`}
      className="block p-5 md:p-6 rounded-xl border border-slate-200 bg-white hover:border-accent-orange/50 hover:shadow-md transition-all"
    >
      <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-1">
        {title}
      </h3>
      <p className="text-sm text-slate-600 line-clamp-2 mb-3">
        {summary}
      </p>
      <div className="flex flex-wrap gap-2">
        <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600">
          {t(`levels.${levelKey}`)}
        </span>
        {tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded bg-accent-orange/10 text-accent-orange font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
      {variant === "default" && post.updatedAt && (
        <p className="text-xs text-slate-500 mt-2">
          {t("common.updated")}: {post.updatedAt}
        </p>
      )}
    </Link>
  );
}
