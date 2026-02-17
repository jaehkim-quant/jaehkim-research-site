import type { Locale } from "@/lib/i18n/translations";
import type { Post } from "./types";

export function getPostTitle(post: Post, locale: Locale): string {
  return locale === "en" && post.titleEn ? post.titleEn : post.title;
}

export function getPostSummary(post: Post, locale: Locale): string {
  return locale === "en" && post.summaryEn ? post.summaryEn : post.summary;
}

export function getPostTags(post: Post, locale: Locale): string[] {
  return locale === "en" && post.tagsEn?.length ? post.tagsEn : post.tags;
}
