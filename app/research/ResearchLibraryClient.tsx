"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ResearchCard } from "@/components/research/ResearchCard";
import { SearchBar } from "@/components/research/SearchBar";
import { FilterChips } from "@/components/research/FilterChips";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getPostSummary, getPostTags, getPostTitle } from "@/lib/research/postLocale";
import type { SortMode } from "@/lib/research/libraryFilters";
import type { Post } from "@/lib/research/types";
import { useResearchLibraryState, type ViewMode } from "./useResearchLibraryState";

const levelKeyMap: Record<string, string> = {
  "초급": "beginner",
  "중급": "intermediate",
  "고급": "advanced",
};

interface ResearchLibraryClientProps {
  initialPosts?: Post[];
}

function formatMonthLabel(key: string) {
  const [year, month] = key.split("-");
  return `${year}년 ${Number(month)}월`;
}

function ResearchContent({ initialPosts = [] }: { initialPosts: Post[] }) {
  const searchParams = useSearchParams();
  const tagFromUrl = searchParams.get("tag");
  const { t } = useTranslation();

  const {
    search,
    setSearch,
    selectedTags,
    toggleTag,
    loading,
    viewMode,
    setViewMode,
    sortMode,
    setSortMode,
    levelFilter,
    setLevelFilter,
    currentPage,
    setCurrentPage,
    filtered,
    totalPages,
    paginated,
    timelineGroups,
  } = useResearchLibraryState(initialPosts, tagFromUrl);

  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="max-w-content mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
          {t("research.title")}
        </h1>
        <p className="text-slate-600 mb-10 max-w-2xl">{t("research.desc")}</p>

        <div className="flex flex-col gap-6 mb-8">
          <SearchBar value={search} onChange={setSearch} />
          <FilterChips selected={selectedTags} onToggle={toggleTag} />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {["all", "초급", "중급", "고급"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                levelFilter === lvl
                  ? "bg-accent-orange text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {lvl === "all"
                ? t("research.levelAll")
                : t(`levels.${levelKeyMap[lvl]}`)}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            {(["card", "list", "timeline"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === mode
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {mode === "card" && t("research.viewCard")}
                {mode === "list" && t("research.viewList")}
                {mode === "timeline" && t("research.viewTimeline")}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">{filtered.length} posts</span>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-accent-orange"
            >
              <option value="newest">{t("research.sortNewest")}</option>
              <option value="oldest">{t("research.sortOldest")}</option>
              <option value="popular">{t("research.sortPopular")}</option>
              <option value="level">{t("research.sortLevel")}</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500">
            {t("research.loading")}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-slate-500 py-16">
            {t("research.noResults")}
          </p>
        ) : viewMode === "timeline" ? (
          <div className="space-y-10">
            {timelineGroups.map(([monthKey, monthPosts]) => (
              <div key={monthKey}>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                  {formatMonthLabel(monthKey)}
                </h3>
                <div className="space-y-3">
                  {monthPosts.map((post) => (
                    <ListRow key={post.id} post={post} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === "list" ? (
          <div className="space-y-3">
            {paginated.map((post) => (
              <ListRow key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((post) => (
              <ResearchCard key={post.id} post={post} showSeriesBadge />
            ))}
          </div>
        )}

        {viewMode !== "timeline" && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-accent-orange text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ListRow({ post }: { post: Post }) {
  const { t } = useTranslation();
  const title = getPostTitle(post);
  const summary = getPostSummary(post);
  const tags = getPostTags(post);
  const levelKey = levelKeyMap[post.level] ?? "beginner";
  const dateStr =
    typeof post.date === "string" && post.date.includes("T")
      ? new Date(post.date).toLocaleDateString()
      : post.date;

  return (
    <Link
      href={`/research/${post.slug}`}
      className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 bg-white hover:border-accent-orange/50 hover:shadow-sm transition-all"
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-slate-900 mb-1 truncate">
          {title}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-1 mb-2">{summary}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            {t(`levels.${levelKey}`)}
          </span>
          {post.seriesId && (
            <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
              {t("research.seriesBadge")}
            </span>
          )}
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
        <span>{dateStr}</span>
        {(post.viewCount ?? 0) > 0 && (
          <span>
            {post.viewCount} {t("research.views")}
          </span>
        )}
        {(post.likeCount ?? 0) > 0 && <span>♥ {post.likeCount}</span>}
      </div>
    </Link>
  );
}

export function ResearchLibraryClient({
  initialPosts = [],
}: ResearchLibraryClientProps) {
  const { t } = useTranslation();

  return (
    <Suspense
      fallback={
        <div className="py-16 md:py-24 max-w-content mx-auto px-6">
          {t("research.loading")}
        </div>
      }
    >
      <ResearchContent initialPosts={initialPosts} />
    </Suspense>
  );
}
