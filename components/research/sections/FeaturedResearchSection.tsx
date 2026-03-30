"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ResearchCard } from "../ResearchCard";
import { useTranslation } from "@/lib/i18n/useTranslation";
import {
  getPostSummary,
  getPostTags,
  getPostTitle,
} from "@/lib/research/postLocale";
import type { Post } from "@/lib/research/types";

interface FeaturedResearchSectionProps {
  initialPosts?: Post[];
}

function formatDate(value: string | Date) {
  if (typeof value === "string" && value.includes("T")) {
    return new Date(value).toLocaleDateString("ko-KR");
  }

  return typeof value === "string"
    ? value
    : new Date(value).toLocaleDateString("ko-KR");
}

export function FeaturedResearchSection({
  initialPosts = [],
}: FeaturedResearchSectionProps = {}) {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(initialPosts.length === 0);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/posts", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Post[]) => setPosts(data.slice(0, 6)))
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const leadPost = posts[0];
  const sidePosts = posts.slice(1, 3);
  const lowerPosts = posts.slice(3, 6);

  return (
    <section className="py-6 md:py-8">
      <div className="terminal-container">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <div className="terminal-label mb-2">Analysis Deck</div>
            <h2 className="terminal-heading text-3xl text-text-title md:text-[2.2rem]">
              {t("home.featuredTitle")}
            </h2>
          </div>
          <div className="terminal-label flex items-center gap-2 text-[0.66rem]">
            <span className="h-2 w-2 rounded-full bg-accent-orange" />
            Live terminal updates
          </div>
        </div>

        <p className="terminal-copy mb-6 max-w-3xl text-sm md:text-base">
          {t("home.featuredDesc")}
        </p>

        {loading ? (
          <div className="terminal-card px-6 py-16 text-center text-text-dark">
            Loading featured research...
          </div>
        ) : posts.length === 0 ? (
          <div className="terminal-card px-6 py-16 text-center text-text-dark">
            No posts yet.
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-12">
            {leadPost && (
              <Link
                href={`/research/${leadPost.slug}`}
                className="terminal-card group relative min-h-[430px] overflow-hidden px-6 py-7 xl:col-span-8 xl:px-8 xl:py-8"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,160,40,0.18),transparent_26%),linear-gradient(135deg,rgba(169,205,255,0.07),transparent_38%)]" />
                <div className="absolute inset-x-10 bottom-0 top-14 rounded-t-full border border-white/5 opacity-25" />
                <div className="absolute inset-x-16 bottom-0 top-24 rounded-t-full border border-white/5 opacity-15" />

                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div className="flex flex-wrap gap-2">
                    <span className="terminal-badge terminal-badge-amber">
                      {leadPost.level}
                    </span>
                    {getPostTags(leadPost)
                      .slice(0, 2)
                      .map((tag) => (
                        <span key={tag} className="terminal-badge terminal-badge-blue">
                          {tag}
                        </span>
                      ))}
                  </div>

                  <div className="max-w-3xl">
                    <div className="terminal-label mb-3">
                      {formatDate(leadPost.date)}
                    </div>
                    <h3 className="terminal-title text-3xl leading-[0.95] text-text-title md:text-5xl">
                      {getPostTitle(leadPost)}
                    </h3>
                    <p className="terminal-copy mt-4 max-w-2xl text-sm md:text-base">
                      {getPostSummary(leadPost)}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-5 text-[0.7rem] text-text-dark">
                      <span className="terminal-label text-[0.62rem]">
                        {leadPost.viewCount ?? 0} {t("research.views")}
                      </span>
                      <span className="terminal-label text-[0.62rem]">
                        ♥ {leadPost.likeCount ?? 0}
                      </span>
                      <span className="terminal-label text-[0.62rem]">
                        {leadPost.commentCount ?? 0} {t("research.comments")}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            <div className="grid gap-4 xl:col-span-4">
              {sidePosts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/research/${post.slug}`}
                  className="terminal-card group flex min-h-[208px] flex-col justify-between p-6"
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span
                        className={`terminal-badge ${index === 0 ? "terminal-badge-amber" : "terminal-badge-blue"}`}
                      >
                        {post.level}
                      </span>
                      <span className="terminal-label text-[0.62rem]">
                        {formatDate(post.date)}
                      </span>
                    </div>
                    <h3 className="terminal-heading text-2xl text-text-title transition-colors group-hover:text-accent-orange">
                      {getPostTitle(post)}
                    </h3>
                  </div>

                  <div className="mt-6">
                    <p className="terminal-copy line-clamp-2 text-sm">
                      {getPostSummary(post)}
                    </p>
                    <div className="mt-5 flex items-end justify-between">
                      <div className="w-24">
                        <svg
                          className={`${index === 0 ? "text-accent-orange" : "text-accent-blue"} h-8 w-full`}
                          viewBox="0 0 100 30"
                          fill="none"
                        >
                          <path
                            d={
                              index === 0
                                ? "M0 21 L10 19 L20 24 L30 15 L40 17 L50 10 L60 18 L70 9 L80 12 L90 4 L100 7"
                                : "M0 16 L14 18 L28 13 L42 15 L56 10 L70 13 L84 11 L100 12"
                            }
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <span className="terminal-number text-sm text-text-title">↗</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {lowerPosts.map((post) => (
              <div key={post.id} className="xl:col-span-4">
                <ResearchCard post={post} variant="compact" showSeriesBadge />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
