"use client";

import { useEffect, useMemo, useState } from "react";
import { TAG_LIST, getTagLabel } from "@/lib/research/data/tagLabels";
import type { Post } from "@/lib/research/types";
import {
  filterAndSortPosts,
  groupPostsByMonth,
  paginatePosts,
  type SortMode,
} from "@/lib/research/libraryFilters";

export type ViewMode = "card" | "list" | "timeline";

export function useResearchLibraryState(
  initialPosts: Post[],
  tagFromUrl: string | null
) {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(initialPosts.length === 0);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (initialPosts.length > 0) return;
    fetch("/api/posts")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [initialPosts.length]);

  useEffect(() => {
    if (!tagFromUrl) return;
    const isKey = TAG_LIST.some((x) => x.key === tagFromUrl);
    const label = isKey ? getTagLabel(tagFromUrl) : tagFromUrl;
    setSelectedTags((prev) => (prev.includes(label) ? prev : [label]));
  }, [tagFromUrl]);

  const filtered = useMemo(
    () =>
      filterAndSortPosts(posts, {
        search,
        selectedTags,
        sortMode,
        levelFilter,
      }),
    [posts, search, selectedTags, sortMode, levelFilter]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedTags, sortMode, levelFilter]);

  const { totalPages, safePage, paginated } = useMemo(
    () => paginatePosts(filtered, currentPage),
    [filtered, currentPage]
  );

  useEffect(() => {
    if (safePage !== currentPage) {
      setCurrentPage(safePage);
    }
  }, [safePage, currentPage]);

  const timelineGroups = useMemo(() => groupPostsByMonth(filtered), [filtered]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return {
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
  };
}
