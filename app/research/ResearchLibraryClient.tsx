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
  초급: "beginner",
  중급: "intermediate",
  고급: "advanced",
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
    <div className="terminal-container space-y-4">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="terminal-card p-6 md:p-8">
          <div className="terminal-label mb-3">Research Terminal</div>
          <h1 className="terminal-title text-4xl text-text-title md:text-5xl">
            {t("research.title")}
          </h1>
          <p className="terminal-copy mt-4 max-w-3xl text-sm md:text-base">
            {t("research.desc")}
          </p>

          <div className="mt-6 space-y-4">
            <SearchBar value={search} onChange={setSearch} />
            <FilterChips selected={selectedTags} onToggle={toggleTag} />
          </div>
        </div>

        <aside className="grid gap-4">
          <div className="terminal-card p-5">
            <div className="terminal-label mb-3">Library Stats</div>
            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="terminal-surface rounded-sm p-4">
                <div className="terminal-label text-[0.62rem]">Visible Posts</div>
                <div className="terminal-number mt-2 text-2xl text-text-title">
                  {filtered.length}
                </div>
              </div>
              <div className="terminal-surface rounded-sm p-4">
                <div className="terminal-label text-[0.62rem]">Active Tags</div>
                <div className="terminal-number mt-2 text-2xl text-accent-orange">
                  {selectedTags.length}
                </div>
              </div>
              <div className="terminal-surface rounded-sm p-4">
                <div className="terminal-label text-[0.62rem]">View Mode</div>
                <div className="terminal-number mt-2 text-2xl text-accent-blue">
                  {viewMode.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <div className="terminal-card p-5">
            <div className="terminal-label mb-3">Distribution</div>
            <div className="space-y-3 text-sm text-text-dark">
              <p>Filter by strategy, risk, factor, and market structure without leaving the archive.</p>
              <p>List and timeline views are optimized for fast scanning, while card view surfaces richer summaries.</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="terminal-card p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {["all", "초급", "중급", "고급"].map((lvl) => {
              const selected = levelFilter === lvl;

              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevelFilter(lvl)}
                  className={`terminal-badge rounded-sm px-3 py-2 ${selected ? "terminal-badge-amber" : "terminal-badge-neutral"}`}
                >
                  {lvl === "all"
                    ? t("research.levelAll")
                    : t(`levels.${levelKeyMap[lvl]}`)}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-sm bg-white/4 p-1">
              {(["card", "list", "timeline"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`rounded-sm px-3 py-2 text-sm ${
                    viewMode === mode
                      ? "bg-white/10 text-text-title"
                      : "text-text-dark hover:text-text-title"
                  }`}
                >
                  {mode === "card" && t("research.viewCard")}
                  {mode === "list" && t("research.viewList")}
                  {mode === "timeline" && t("research.viewTimeline")}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="terminal-label text-[0.62rem]">
                {filtered.length} posts
              </span>
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                className="terminal-select min-w-[150px] py-2 text-sm"
              >
                <option value="newest">{t("research.sortNewest")}</option>
                <option value="oldest">{t("research.sortOldest")}</option>
                <option value="popular">{t("research.sortPopular")}</option>
                <option value="level">{t("research.sortLevel")}</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="terminal-card px-6 py-16 text-center text-text-dark">
          {t("research.loading")}
        </div>
      ) : filtered.length === 0 ? (
        <div className="terminal-card px-6 py-16 text-center text-text-dark">
          {t("research.noResults")}
        </div>
      ) : viewMode === "timeline" ? (
        <section className="space-y-4">
          {timelineGroups.map(([monthKey, monthPosts]) => (
            <div key={monthKey} className="terminal-card p-5 md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="terminal-label text-[0.62rem]">Timeline</span>
                <h2 className="terminal-heading text-2xl text-text-title">
                  {formatMonthLabel(monthKey)}
                </h2>
              </div>
              <div className="space-y-3">
                {monthPosts.map((post) => (
                  <ListRow key={post.id} post={post} />
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : viewMode === "list" ? (
        <section className="terminal-card p-4 md:p-5">
          <div className="space-y-3">
            {paginated.map((post) => (
              <ListRow key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paginated.map((post) => (
            <ResearchCard key={post.id} post={post} showSeriesBadge />
          ))}
        </section>
      )}

      {viewMode !== "timeline" && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="terminal-outline-button px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={
                currentPage === page
                  ? "terminal-primary-button px-4 py-2 text-sm"
                  : "terminal-outline-button px-4 py-2 text-sm"
              }
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="terminal-outline-button px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            →
          </button>
        </div>
      )}
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
      ? new Date(post.date).toLocaleDateString("ko-KR")
      : post.date;

  return (
    <Link
      href={`/research/${post.slug}`}
      className="terminal-list-row flex flex-col gap-4 px-4 py-4 md:flex-row md:items-start md:px-5"
    >
      <div className="flex-1 min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="terminal-badge terminal-badge-neutral">
            {t(`levels.${levelKey}`)}
          </span>
          {post.seriesId && (
            <span className="terminal-badge terminal-badge-blue">
              {t("research.seriesBadge")}
            </span>
          )}
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="terminal-badge terminal-badge-amber">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="terminal-heading text-xl text-text-title">{title}</h3>
        <p className="terminal-copy mt-2 line-clamp-2 text-sm">{summary}</p>
      </div>
      <div className="flex flex-row gap-4 text-[0.72rem] text-text-dark md:flex-col md:items-end">
        <span className="terminal-label text-[0.62rem]">{dateStr}</span>
        <span className="terminal-label text-[0.62rem]">
          {post.viewCount ?? 0} {t("research.views")}
        </span>
        <span className="terminal-label text-[0.62rem]">♥ {post.likeCount ?? 0}</span>
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
        <div className="terminal-container terminal-card px-6 py-16 text-center text-text-dark">
          {t("research.loading")}
        </div>
      }
    >
      <ResearchContent initialPosts={initialPosts} />
    </Suspense>
  );
}
