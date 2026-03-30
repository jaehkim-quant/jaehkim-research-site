"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import {
  getPostSummary,
  getPostTags,
  getPostTitle,
} from "@/lib/research/postLocale";
import type { Post } from "@/lib/research/types";

const levelKeyMap: Record<string, string> = {
  초급: "beginner",
  중급: "intermediate",
  고급: "advanced",
};

interface ResearchCardProps {
  post: Post;
  variant?: "default" | "compact";
  showSeriesBadge?: boolean;
}

function formatUpdatedAt(updatedAt: string | undefined, label: string) {
  if (!updatedAt) return null;
  const normalized =
    typeof updatedAt === "string" && updatedAt.includes("T")
      ? new Date(updatedAt).toLocaleDateString()
      : updatedAt;

  return `${label}: ${normalized}`;
}

export function ResearchCard({
  post,
  variant = "default",
  showSeriesBadge = false,
}: ResearchCardProps) {
  const { t } = useTranslation();
  const levelKey = levelKeyMap[post.level] ?? "beginner";
  const title = getPostTitle(post);
  const summary = getPostSummary(post);
  const tags = getPostTags(post);
  const updatedLabel = formatUpdatedAt(post.updatedAt, t("common.updated"));

  return (
    <Link
      href={`/research/${post.slug}`}
      className={`group terminal-card block h-full ${variant === "compact" ? "p-5" : "p-6"} hover:-translate-y-1`}
    >
      <div className="flex h-full flex-col">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="terminal-badge terminal-badge-neutral">
            {t(`levels.${levelKey}`)}
          </span>
          {showSeriesBadge && post.seriesId && (
            <span className="terminal-badge terminal-badge-blue">
              {t("research.seriesBadge")}
            </span>
          )}
          {tags.slice(0, variant === "compact" ? 2 : 3).map((tag) => (
            <span key={tag} className="terminal-badge terminal-badge-amber">
              {tag}
            </span>
          ))}
        </div>

        <h3
          className={`terminal-heading mb-3 text-text-title transition-colors group-hover:text-accent-orange ${variant === "compact" ? "text-lg" : "text-xl"}`}
        >
          {title}
        </h3>

        <p
          className={`terminal-copy ${variant === "compact" ? "line-clamp-2 text-sm" : "line-clamp-3 text-sm md:text-[0.95rem]"}`}
        >
          {summary}
        </p>

        <div className="mt-auto pt-5">
          <div className="terminal-divider mb-4" />
          <div className="flex flex-wrap items-center justify-between gap-2 text-[0.72rem] text-text-dark">
            <div className="terminal-label flex flex-wrap items-center gap-3 text-[0.62rem]">
              <span>{post.viewCount ?? 0} {t("research.views")}</span>
              <span>♥ {post.likeCount ?? 0}</span>
              <span>{post.commentCount ?? 0} {t("research.comments")}</span>
            </div>
            {variant === "default" && updatedLabel && (
              <span className="terminal-label text-[0.62rem] text-text-dark">
                {updatedLabel}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
