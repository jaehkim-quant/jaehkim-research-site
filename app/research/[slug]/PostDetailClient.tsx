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
      ? new Date(initialPost.date).toLocaleDateString("ko-KR")
      : initialPost.date;

  return (
    <article className="terminal-container space-y-4">
      <Link
        href="/research"
        className="terminal-label inline-flex items-center gap-2 text-[0.66rem] text-accent-orange hover:text-accent-orange/80"
      >
        ← {t("research.backToLibrary")}
      </Link>

      <section className="terminal-card px-6 py-8 md:px-8 md:py-10">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="terminal-badge terminal-badge-neutral">
                {t(`levels.${levelKey}`)}
              </span>
              {tags.map((tag, index) => (
                <span
                  key={tag}
                  className={`terminal-badge ${index === 0 ? "terminal-badge-amber" : "terminal-badge-blue"}`}
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="terminal-title text-4xl leading-[0.96] text-text-title md:text-5xl xl:text-6xl">
              {title}
            </h1>
            <p className="terminal-copy mt-5 max-w-3xl text-sm md:text-base">
              {summary}
            </p>
          </div>

          <div className="terminal-surface rounded-sm p-5">
            <div className="terminal-label mb-4">Research Packet</div>
            <div className="space-y-4 text-sm text-text-dark">
              <div className="flex items-end justify-between gap-4">
                <span className="terminal-label text-[0.62rem]">Published</span>
                <span className="terminal-number text-text-title">{dateStr}</span>
              </div>
              <div className="flex items-end justify-between gap-4">
                <span className="terminal-label text-[0.62rem]">Read Time</span>
                <span className="terminal-number text-text-title">
                  {readTime} {t("research.minRead")}
                </span>
              </div>
              <div className="flex items-end justify-between gap-4">
                <span className="terminal-label text-[0.62rem]">Views</span>
                <span className="terminal-number text-text-title">{viewCount}</span>
              </div>
              <div className="flex items-end justify-between gap-4">
                <span className="terminal-label text-[0.62rem]">Comments</span>
                <span className="terminal-number text-text-title">
                  {totalCommentCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <section className="terminal-card p-6">
            <div className="terminal-label mb-3">{t("research.summaryTab")}</div>
            <p className="terminal-copy text-sm md:text-base">{summary}</p>
          </section>

          <section className="terminal-card p-6 md:p-7" ref={contentRef}>
            <div className="terminal-label mb-4">{t("research.deepDiveTab")}</div>
            {content ? (
              <MarkdownRenderer markdown={content} />
            ) : (
              <p className="terminal-copy">{t("research.deepDivePlaceholder")}</p>
            )}
          </section>

          <section className="terminal-card p-5">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleLike}
                className={`terminal-outline-button px-4 py-3 text-sm ${liked ? "border-accent-orange text-accent-orange" : ""}`}
              >
                <span>{liked ? "♥" : "♡"}</span>
                <span className="terminal-number">{likeCount}</span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={handleShare}
                  className="terminal-outline-button px-4 py-3 text-sm"
                >
                  {t("research.copyLink")}
                </button>
                {shareTooltip && (
                  <span className="terminal-label absolute -top-8 left-1/2 -translate-x-1/2 rounded-sm bg-black/80 px-2 py-1 text-[0.58rem] text-text-title">
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
                className="terminal-outline-button px-4 py-3 text-sm"
              >
                X
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  canonicalUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="terminal-outline-button px-4 py-3 text-sm"
              >
                LinkedIn
              </a>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {navigation.prevPost ? (
              <Link
                href={`/research/${navigation.prevPost.slug}`}
                className="terminal-card p-5"
              >
                <div className="terminal-label mb-3">{t("research.prevPost")}</div>
                <h3 className="terminal-heading text-lg text-text-title">
                  {navigation.prevPost.title}
                </h3>
                <p className="terminal-copy mt-2 line-clamp-2 text-sm">
                  {navigation.prevPost.summary}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {navigation.nextPost ? (
              <Link
                href={`/research/${navigation.nextPost.slug}`}
                className="terminal-card p-5 text-left md:text-right"
              >
                <div className="terminal-label mb-3">{t("research.nextPost")}</div>
                <h3 className="terminal-heading text-lg text-text-title">
                  {navigation.nextPost.title}
                </h3>
                <p className="terminal-copy mt-2 line-clamp-2 text-sm">
                  {navigation.nextPost.summary}
                </p>
              </Link>
            ) : (
              <div />
            )}
          </section>

          {navigation.relatedPosts.length > 0 && (
            <section className="terminal-card p-6">
              <div className="terminal-label mb-3">
                {t("research.relatedPosts")}
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {navigation.relatedPosts.map((rp) => (
                  <Link
                    key={rp.id}
                    href={`/research/${rp.slug}`}
                    className="terminal-list-row h-full px-4 py-4"
                  >
                    <h3 className="terminal-heading text-lg text-text-title">
                      {rp.title}
                    </h3>
                    <p className="terminal-copy mt-2 line-clamp-3 text-sm">
                      {rp.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="terminal-card p-6">
            <CommentSection
              postId={initialPost.id}
              comments={comments}
              onCommentAdded={handleCommentAdded}
            />
          </section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          {toc.length > 0 && (
            <section className="terminal-card p-5">
              <div className="terminal-label mb-4">Table of Contents</div>
              <nav className="space-y-2">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-sm text-text-dark hover:text-accent-orange ${
                      item.level === 3 ? "pl-4" : ""
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </section>
          )}

          <section className="terminal-card p-5">
            <div className="terminal-label mb-4">Document Signals</div>
            <div className="space-y-3">
              <div className="terminal-surface rounded-sm p-4">
                <div className="terminal-label text-[0.62rem]">Tags</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="terminal-badge terminal-badge-amber">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="terminal-surface rounded-sm p-4">
                <div className="terminal-label text-[0.62rem]">Canonical URL</div>
                <p className="mt-3 break-all text-sm text-text-dark">
                  {canonicalUrl}
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </article>
  );
}
