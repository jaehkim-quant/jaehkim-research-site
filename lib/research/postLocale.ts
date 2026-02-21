import type { Post } from "./types";

export function getPostTitle(post: Post): string {
  return post.title;
}

export function getPostSummary(post: Post): string {
  return post.summary;
}

export function getPostTags(post: Post): string[] {
  return post.tags;
}
