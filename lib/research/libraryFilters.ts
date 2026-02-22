import type { Post } from "./types";
import { getPostSummary, getPostTags, getPostTitle } from "./postLocale";

export type SortMode = "newest" | "oldest" | "popular" | "level";

export const POSTS_PER_PAGE = 12;

const levelOrder: Record<string, number> = {
  "초급": 0,
  "중급": 1,
  "고급": 2,
};

export interface LibraryFilterOptions {
  search: string;
  selectedTags: string[];
  sortMode: SortMode;
  levelFilter: string;
}

export function filterAndSortPosts(
  posts: Post[],
  { search, selectedTags, sortMode, levelFilter }: LibraryFilterOptions
): Post[] {
  let result = posts;

  if (levelFilter !== "all") {
    result = result.filter((p) => p.level === levelFilter);
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter((p) => {
      const title = getPostTitle(p);
      const summary = getPostSummary(p);
      const tags = getPostTags(p);
      return (
        title.toLowerCase().includes(q) ||
        summary.toLowerCase().includes(q) ||
        tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }

  if (selectedTags.length > 0) {
    result = result.filter((p) => {
      const tags = getPostTags(p);
      return selectedTags.some((sel) => tags.includes(sel));
    });
  }

  switch (sortMode) {
    case "oldest":
      return [...result].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    case "popular":
      return [...result].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    case "level":
      return [...result].sort(
        (a, b) => (levelOrder[a.level] ?? 1) - (levelOrder[b.level] ?? 1)
      );
    case "newest":
    default:
      return [...result].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }
}

export function paginatePosts(
  posts: Post[],
  currentPage: number,
  perPage = POSTS_PER_PAGE
) {
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));
  const safePage = Math.min(totalPages, Math.max(1, currentPage));
  const paginated = posts.slice((safePage - 1) * perPage, safePage * perPage);

  return { totalPages, safePage, paginated };
}

export function groupPostsByMonth(posts: Post[]): Array<[string, Post[]]> {
  const groups: Record<string, Post[]> = {};

  posts.forEach((post) => {
    const d = new Date(post.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(post);
  });

  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}
