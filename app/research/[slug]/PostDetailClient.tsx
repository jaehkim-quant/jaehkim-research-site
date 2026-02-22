"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { CommentSection } from "@/components/research/CommentSection";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import type { Post } from "@/lib/research/types";
import {
  estimateReadTime,
  extractToc,
  getCommentTotal,
} from "@/lib/research/postDetail";

interface LinkedPostPreview {
  id: string;
  slug: string;
  title: string;
  summary: string;
}

interface PostDetailNavigation {
  prevPost: LinkedPostPreview | null;
  nextPost: LinkedPostPreview | null;
  relatedPosts: LinkedPostPreview[];
}

interface PostDetailClientProps {
  initialPost: Post;
  navigation: PostDetailNavigation;
  initialComments?: Comment[];
  canonicalUrl: string;
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

export default function PostDetailClient({
  initialPost,
  navigation,
  initialComments = [],
  canonicalUrl,
}: PostDetailClientProps) {
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement>(null);
  const viewRecordedRef = useRef(false);

  const [viewCount, setViewCount] = useState(initialPost.viewCount ?? 0);
  const [likeCount, setLikeCount] = useState(initialPost.likeCount ?? 0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [shareTooltip, setShareTooltip] = useState(false);

  useEffect(() => {
    viewRecordedRef.current = false;
    setViewCount(initialPost.viewCount ?? 0);
    setLikeCount(initialPost.likeCount ?? 0);
    setComments(initialComments);
  }, [initialPost, initialComments]);

  useEffect(() => {
    if (viewRecordedRef.current) return;
    viewRecordedRef.current = true;

    setViewCount((prev) => prev + 1);
    fetch(`/api/posts/${initialPost.id}/view`, { method: "POST" })
      .then((r) => r.json())
      .then(
        (d) => typeof d.viewCount === "number" && setViewCount(d.viewCount)
      )
      .catch(() => setViewCount((prev) => Math.max(0, prev - 1)));

    fetch(`/api/posts/${initialPost.id}/like`)
      .then((r) => r.json())
      .then((d) => {
        setLikeCount(d.likeCount);
        setLiked(d.liked);
      })
      .catch(() => {});
  }, [initialPost.id]);

  const handleLike = async () => {
    const res = await fetch(`/api/posts/${initialPost.id}/like`, {
      method: "POST",
    });
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
    const shareUrl =
      typeof window !== "undefined" ? window.location.href : canonicalUrl;
    await navigator.clipboard.writeText(shareUrl);
    setShareTooltip(true);
    setTimeout(() => setShareTooltip(false), 2000);
  };

  const levelKey = levelKeyMap[initialPost.level as string] ?? "beginner";
  const title = initialPost.title;
  const summary = initialPost.summary;
  const tags = initialPost.tags;
  const content = initialPost.content;
  const readTime = useMemo(() => estimateReadTime(content), [content]);
  const toc = useMemo(() => extractToc(content), [content]);
  const totalCommentCount = useMemo(
    () => getCommentTotal(initialPost.commentCount, comments),
    [initialPost.commentCount, comments]
  );

  const dateStr =
    typeof initialPost.date === "string" && initialPost.date.includes("T")
      ? new Date(initialPost.date).toLocaleDateString()
      : initialPost.date;

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
          <span>
            {readTime} {t("research.minRead")}
          </span>
          <span>
            {viewCount} {t("research.views")}
          </span>
          <span>♥ {likeCount}</span>
          <span>
            {totalCommentCount} {t("research.comments")}
          </span>
        </div>

        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <div className="rounded-xl border border-slate-200 p-6 bg-slate-50 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">
                {t("research.summaryTab")}
              </h2>
              <p className="text-slate-600">{summary}</p>
            </div>

            {content ? (
              <div
                className="rounded-xl border border-slate-200 p-6 mb-8"
                ref={contentRef}
              >
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  {t("research.deepDiveTab")}
                </h2>
                <MarkdownRenderer markdown={content} className="text-slate-700" />
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
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(
                  title
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium"
              >
                X (Twitter)
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  canonicalUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium"
              >
                LinkedIn
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-12">
              {navigation.prevPost ? (
                <Link
                  href={`/research/${navigation.prevPost.slug}`}
                  className="p-4 rounded-lg border border-slate-200 hover:border-accent-orange/50 transition-colors"
                >
                  <span className="text-xs text-slate-500">
                    ← {t("research.prevPost")}
                  </span>
                  <p className="text-sm font-medium text-slate-900 mt-1 line-clamp-1">
                    {navigation.prevPost.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
              {navigation.nextPost ? (
                <Link
                  href={`/research/${navigation.nextPost.slug}`}
                  className="p-4 rounded-lg border border-slate-200 hover:border-accent-orange/50 transition-colors text-right"
                >
                  <span className="text-xs text-slate-500">
                    {t("research.nextPost")} →
                  </span>
                  <p className="text-sm font-medium text-slate-900 mt-1 line-clamp-1">
                    {navigation.nextPost.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
            </div>

            {navigation.relatedPosts.length > 0 && (
              <div className="mb-12">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  {t("research.relatedPosts")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {navigation.relatedPosts.map((rp) => (
                    <Link
                      key={rp.id}
                      href={`/research/${rp.slug}`}
                      className="p-4 rounded-lg border border-slate-200 hover:border-accent-orange/50 transition-colors"
                    >
                      <h4 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-1">
                        {rp.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {rp.summary}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <CommentSection
              postId={initialPost.id}
              comments={comments}
              onCommentAdded={handleCommentAdded}
            />
          </div>

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
