"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getPostSummary, getPostTags, getPostTitle } from "@/lib/research/postLocale";
import type { Post } from "@/lib/research/types";

interface LatestPostsSectionProps {
  initialPosts?: Post[];
}

function formatDate(value: string | Date) {
  if (typeof value === "string" && value.includes("T")) {
    return new Date(value).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return typeof value === "string"
    ? value
    : new Date(value).toLocaleDateString("ko-KR");
}

export function LatestPostsSection({
  initialPosts = [],
}: LatestPostsSectionProps = {}) {
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
      .then((data: Post[]) => setPosts(data.slice(0, 5)))
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <section className="py-6 md:py-8">
      <div className="terminal-container">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="terminal-card p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <div className="terminal-label mb-2">Live Feed</div>
                <h2 className="terminal-heading text-3xl text-text-title md:text-[2.2rem]">
                  {t("home.latestTitle")}
                </h2>
              </div>
              <Link
                href="/research"
                className="terminal-label text-[0.66rem] text-accent-orange hover:text-accent-orange/80"
              >
                {t("home.viewAll")}
              </Link>
            </div>

            {loading ? (
              <div className="py-16 text-center text-text-dark">Loading...</div>
            ) : posts.length === 0 ? (
              <div className="py-16 text-center text-text-dark">No posts yet.</div>
            ) : (
              <div className="space-y-3">
                {posts.map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/research/${post.slug}`}
                    className="terminal-list-row block px-4 py-5 md:px-5"
                  >
                    <div className="grid gap-3 md:grid-cols-[74px_minmax(0,1fr)]">
                      <div className="terminal-label text-[0.62rem] text-text-dark">
                        {index === 0 ? "Breaking" : formatDate(post.date)}
                      </div>
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          {getPostTags(post)
                            .slice(0, 2)
                            .map((tag, tagIndex) => (
                              <span
                                key={tag}
                                className={`terminal-badge ${tagIndex === 0 ? "terminal-badge-amber" : "terminal-badge-blue"}`}
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                        <h3 className="terminal-heading text-xl text-text-title">
                          {getPostTitle(post)}
                        </h3>
                        <p className="terminal-copy mt-2 line-clamp-2 text-sm">
                          {getPostSummary(post)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4">
            <div className="terminal-card p-5">
              <div className="terminal-label mb-4">Market Pulse</div>
              <div className="space-y-4">
                {[
                  ["KOSPI 200", "2,455.12", "+1.22%"],
                  ["S&P 500 FUT", "5,102.40", "-0.04%"],
                  ["BTC/USD", "82,104.50", "+4.18%"],
                ].map(([label, value, delta]) => (
                  <div key={label} className="flex items-end justify-between gap-3">
                    <div>
                      <div className="terminal-label text-[0.62rem]">{label}</div>
                      <div className="terminal-number mt-1 text-lg text-text-title">
                        {value}
                      </div>
                    </div>
                    <span
                      className={`terminal-label text-[0.62rem] ${delta.startsWith("+") ? "text-accent-orange" : "text-accent-blue"}`}
                    >
                      {delta}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-sm bg-accent-orange p-6 text-[#2c1700] shadow-terminal">
              <div className="terminal-label text-[#5d3200]">Morning Alpha</div>
              <h3 className="terminal-heading mt-3 text-3xl text-[#2c1700]">
                Daily terminal brief
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5d3200]">
                Elite financial insights delivered before the opening bell with
                new research, field notes, and idea queues.
              </p>
              <Link
                href="/subscribe"
                className="mt-5 inline-flex rounded-sm border border-[#7c4300] bg-[#1a120a] px-4 py-3 font-label text-xs uppercase tracking-[0.22em] text-[#f9d9b7]"
              >
                Join Intelligence Network
              </Link>
            </div>

            <div className="terminal-card p-5">
              <div className="terminal-label mb-3">Entity Status</div>
              <h3 className="terminal-heading text-xl text-text-title">
                Secure Research Node 04
              </h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="terminal-surface rounded-sm p-4">
                  <div className="terminal-label text-[0.62rem]">Uptime</div>
                  <div className="terminal-number mt-2 text-lg text-text-title">
                    99.98%
                  </div>
                </div>
                <div className="terminal-surface rounded-sm p-4">
                  <div className="terminal-label text-[0.62rem]">Latency</div>
                  <div className="terminal-number mt-2 text-lg text-text-title">
                    41ms
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
