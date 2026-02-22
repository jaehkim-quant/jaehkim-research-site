import { describe, expect, it } from "vitest";
import {
  filterAndSortPosts,
  groupPostsByMonth,
  paginatePosts,
} from "../lib/research/libraryFilters";
import type { Post } from "../lib/research/types";

const posts: Post[] = [
  {
    id: "1",
    title: "Momentum",
    slug: "a1",
    summary: "Momentum strategy",
    tags: ["모멘텀", "주식"],
    level: "초급",
    date: "2025-01-02T00:00:00.000Z",
    viewCount: 100,
  },
  {
    id: "2",
    title: "Value",
    slug: "a2",
    summary: "Value strategy",
    tags: ["가치", "주식"],
    level: "중급",
    date: "2025-02-02T00:00:00.000Z",
    viewCount: 50,
  },
  {
    id: "3",
    title: "Macro Regime",
    slug: "a3",
    summary: "Macro signal",
    tags: ["매크로"],
    level: "고급",
    date: "2024-12-02T00:00:00.000Z",
    viewCount: 200,
  },
];

describe("research library filters", () => {
  it("filters by level and tags", () => {
    const filtered = filterAndSortPosts(posts, {
      search: "",
      selectedTags: ["가치"],
      sortMode: "newest",
      levelFilter: "중급",
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].slug).toBe("a2");
  });

  it("filters by search across title/summary/tags", () => {
    const filtered = filterAndSortPosts(posts, {
      search: "macro",
      selectedTags: [],
      sortMode: "newest",
      levelFilter: "all",
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].slug).toBe("a3");
  });

  it("sorts by popularity", () => {
    const filtered = filterAndSortPosts(posts, {
      search: "",
      selectedTags: [],
      sortMode: "popular",
      levelFilter: "all",
    });
    expect(filtered[0].slug).toBe("a3");
  });

  it("paginates safely with clamped page number", () => {
    const { totalPages, safePage, paginated } = paginatePosts(posts, 99, 2);
    expect(totalPages).toBe(2);
    expect(safePage).toBe(2);
    expect(paginated).toHaveLength(1);
  });

  it("groups posts by YYYY-MM month key", () => {
    const groups = groupPostsByMonth(posts);
    expect(groups[0][0]).toBe("2025-02");
    expect(groups[1][0]).toBe("2025-01");
  });
});
