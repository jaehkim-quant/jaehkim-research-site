"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import {
  getPostTitle,
  getPostSummary,
  getPostTags,
} from "@/lib/research/postLocale";
import { CommentSection } from "@/components/research/CommentSection";
import type { Post } from "@/lib/research/types";

interface PostDetailClientProps {
  initialPost?: Post | null;
  initialAllPosts?: Post[];
}

const levelKeyMap: Record<string, string> = {
  초급: "beginner",
  중급: "intermediate",
  고급: "advanced",
};

interface Reply {
  id: string;
  name: string;
  content: string;
  parentId: string;
  createdAt: string;
}

interface Comment {
  id: string;
  name: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  replies: Reply[];
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function estimateReadTime(html: string | undefined): number {
  if (!html) return 1;
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function extractToc(html: string | undefined): TocItem[] {
  if (!html) return [];
  const regex = /<(h[2-3])[^>]*id="([^"]*)"[^>]*>(.*?)<\/\1>/gi;
  const items: TocItem[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    items.push({
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, ""),
      level: parseInt(match[1][1]),
    });
  }
  if (items.length === 0) {
    const fallback = /<(h[2-3])[^>]*>(.*?)<\/\1>/gi;
    while ((match = fallback.exec(html)) !== null) {
      const text = match[2].replace(/<[^>]*>/g, "");
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]+/g, "-")
        .replace(/(^-|-$)/g, "");
      items.push({ id, text, level: parseInt(match[1][1]) });
    }
  }
  return items;
}

export default function PostDetailClient({
  initialPost = null,
  initialAllPosts = [],
}: PostDetailClientProps = {}) {
  const params = useParams();
  const slug = params.slug as string;
  const { t, locale } = useTranslation();
  const contentRef = useRef<HTMLDivElement>(null);

  const [allPosts, setAllPosts] = useState<Post[]>(initialAllPosts);
  const [post, setPost] = useState<Post | null>(initialPost);
  const [pageLoading, setPageLoading] = useState(!initialPost);
  const [viewCount, setViewCount] = useState(initialPost?.viewCount ?? 0);
  const [likeCount, setLikeCount] = useState(initialPost?.likeCount ?? 0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [shareTooltip, setShareTooltip] = useState(false);
  const viewRecordedRef = useRef(false);

  useEffect(() => {
    if (initialPost && initialAllPosts.length > 0) return;
    fetch("/api/posts")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Post[]) => {
        setAllPosts(data);
        if (!initialPost) {
          const found = data.find((p) => p.slug === slug);
          if (found) {
            setPost(found);
            setViewCount(found.viewCount || 0);
          }
        }
      })
      .catch(() => {})
      .finally(() => setPageLoading(false));
  }, [slug, initialPost, initialAllPosts.length]);

  useEffect(() => {
    if (!post || viewRecordedRef.current) return;
    viewRecordedRef.current = true;
    setViewCount((prev) => prev + 1);
    fetch(`/api/posts/${post.id}/view`, { method: "POST" })
      .then((r) => r.json())
      .then((d) => typeof d.viewCount === "number" && setViewCount(d.viewCount))
      .catch(() => setViewCount((prev) => Math.max(0, prev - 1)));

    fetch(`/api/posts/${post.id}/like`)
      .then((r) => r.json())
      .then((d) => {
        setLikeCount(d.likeCount);
        setLiked(d.liked);
      })
      .catch(() => {});

    fetch(`/api/posts/${post.id}/comments`)
      .then((r) => r.json())
      .then((d) => setComments(d))
      .catch(() => {});
  }, [post]);

  const handleLike = async () => {
    if (!post) return;
    const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
    if (res.ok) {
      const d = await res.json();
      setLikeCount(d.likeCount);
      setLiked(d.liked);
    }
  };

  const handleCommentAdded = (comment: Comment | Reply, parentId?: string) => {
    if (parentId) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies || []), comment as Reply] }
            : c
        )
      );
    } else {
      setComments((prev) => [comment as Comment, ...prev]);
    }
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setShareTooltip(true);
    setTimeout(() => setShareTooltip(false), 2000);
  };

  if (pageLoading) {
    return (
      <div className="py-16 max-w-content mx-auto px-6">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-16 max-w-content mx-auto px-6">
        <p className="text-slate-600">Not found.</p>
      </div>
    );
  }

  const levelKey = levelKeyMap[post.level as string] ?? "beginner";
  const title = getPostTitle(post, locale);
  const summary = getPostSummary(post, locale);
  const tags = getPostTags(post, locale);
  const content =
    locale === "en" && post.contentEn ? post.contentEn : post.content;
  const readTime = estimateReadTime(content);
  const toc = extractToc(content);

  const sortedPosts = [...allPosts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const currentIdx = sortedPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIdx > 0 ? sortedPosts[currentIdx - 1] : null;
  const nextPost =
    currentIdx < sortedPosts.length - 1 ? sortedPosts[currentIdx + 1] : null;

  const relatedPosts = allPosts
    .filter(
      (p) =>
        p.id !== post.id &&
        p.tags.some((tag) => post.tags.includes(tag))
    )
    .slice(0, 3);

  const dateStr =
    typeof post.date === "string" && post.date.includes("T")
      ? new Date(post.date).toLocaleDateString()
      : post.date;

  return (
    <article className="py-16 md:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <Link
          href="/research"
          className="text-sm font-medium text-accent-orange hover:underline mb-6 inline-block"
        >
          {t("research.backToLibrary")}
        </Link>

        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
          {title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600">
            {t(`levels.${levelKey}`)}
          </span>
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded bg-accent-orange/10 text-accent-orange font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8">
          <span>{dateStr}</span>
          <span>{readTime} {t("research.minRead")}</span>
          <span>{viewCount} {t("research.views")}</span>
          <span>♥ {likeCount}</span>
          <span>
            {comments.length > 0
              ? comments.length + comments.reduce((a, c) => a + (c.replies?.length || 0), 0)
              : (post.commentCount ?? 0)}{" "}
            {t("research.comments")}
          </span>
        </div>

        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Summary */}
            <div className="rounded-xl border border-slate-200 p-6 bg-slate-50 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">
                {t("research.summaryTab")}
              </h2>
              <p className="text-slate-600">{summary}</p>
            </div>

            {/* Deep Dive */}
            {content ? (
              <div className="rounded-xl border border-slate-200 p-6 mb-8" ref={contentRef}>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  {t("research.deepDiveTab")}
                </h2>
                <div
                  className="prose prose-sm max-w-none text-slate-700"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 p-6 mb-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  {t("research.deepDiveTab")}
                </h2>
                <p className="text-slate-600">
                  {t("research.deepDivePlaceholder")}
                </p>
              </div>
            )}

            {/* Like + Share bar */}
            <div className="flex items-center gap-4 py-6 border-t border-b border-slate-200 mb-8">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  liked
                    ? "border-red-300 bg-red-50 text-red-600"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="text-lg">{liked ? "♥" : "♡"}</span>
                <span className="text-sm font-medium">{likeCount}</span>
              </button>

              <div className="relative">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-medium">
                    {t("research.copyLink")}
                  </span>
                </button>
                {shareTooltip && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-slate-800 text-white rounded">
                    {t("research.copied")}
                  </span>
                )}
              </div>

              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium"
              >
                X (Twitter)
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium"
              >
                LinkedIn
              </a>
            </div>

            {/* Prev / Next */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              {prevPost ? (
                <Link
                  href={`/research/${prevPost.slug}`}
                  className="p-4 rounded-lg border border-slate-200 hover:border-accent-orange/50 transition-colors"
                >
                  <span className="text-xs text-slate-500">
                    ← {t("research.prevPost")}
                  </span>
                  <p className="text-sm font-medium text-slate-900 mt-1 line-clamp-1">
                    {getPostTitle(prevPost, locale)}
                  </p>
                </Link>
              ) : (
                <div />
              )}
              {nextPost ? (
                <Link
                  href={`/research/${nextPost.slug}`}
                  className="p-4 rounded-lg border border-slate-200 hover:border-accent-orange/50 transition-colors text-right"
                >
                  <span className="text-xs text-slate-500">
                    {t("research.nextPost")} →
                  </span>
                  <p className="text-sm font-medium text-slate-900 mt-1 line-clamp-1">
                    {getPostTitle(nextPost, locale)}
                  </p>
                </Link>
              ) : (
                <div />
              )}
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mb-12">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  {t("research.relatedPosts")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedPosts.map((rp) => (
                    <Link
                      key={rp.id}
                      href={`/research/${rp.slug}`}
                      className="p-4 rounded-lg border border-slate-200 hover:border-accent-orange/50 transition-colors"
                    >
                      <h4 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-1">
                        {getPostTitle(rp, locale)}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {getPostSummary(rp, locale)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <CommentSection
              postId={post.id}
              comments={comments}
              onCommentAdded={handleCommentAdded}
            />
          </div>

          {/* Sidebar: TOC (desktop only) */}
          {toc.length > 0 && (
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Table of Contents
                </p>
                <nav className="space-y-1.5">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-sm text-slate-600 hover:text-accent-orange transition-colors ${
                        item.level === 3 ? "pl-3" : ""
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </div>
    </article>
  );
}
