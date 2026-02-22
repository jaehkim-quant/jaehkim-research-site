import type { Prisma } from "@prisma/client";
import type { Level, Post } from "./types";

export const postListSelect = {
  id: true,
  title: true,
  slug: true,
  summary: true,
  tags: true,
  level: true,
  published: true,
  date: true,
  updatedAt: true,
  viewCount: true,
  seriesId: true,
  seriesOrder: true,
  _count: { select: { likes: true, comments: true } },
} satisfies Prisma.PostSelect;

export type PostListRecord = Prisma.PostGetPayload<{
  select: typeof postListSelect;
}>;

export function serializePostListItem(post: PostListRecord): Post {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    tags: post.tags,
    level: post.level as Level,
    published: post.published,
    date: post.date.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    viewCount: post.viewCount,
    seriesId: post.seriesId ?? undefined,
    seriesOrder: post.seriesOrder ?? undefined,
    likeCount: post._count.likes,
    commentCount: post._count.comments,
  };
}

interface SeriesListRecord {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  type: string;
  level: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: { posts: number };
}

export function serializeSeriesListItem(series: SeriesListRecord) {
  return {
    id: series.id,
    title: series.title,
    slug: series.slug,
    description: series.description ?? undefined,
    type: series.type,
    level: series.level,
    published: series.published,
    createdAt: series.createdAt.toISOString(),
    updatedAt: series.updatedAt.toISOString(),
    postCount: series._count.posts,
  };
}
