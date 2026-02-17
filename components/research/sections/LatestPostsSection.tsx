"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getPostTitle, getPostSummary } from "@/lib/research/postLocale";
import type { Post } from "@/lib/research/types";

interface LatestPostsSectionProps {
  initialPosts?: Post[];
}

export function LatestPostsSection({
  initialPosts = [],
}: LatestPostsSectionProps = {}) {
  const { t, locale } = useTranslation();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(initialPosts.length === 0);

  useEffect(() => {
    if (initialPosts.length > 0) return;
    fetch("/api/posts")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Post[]) => setPosts(data.slice(0, 5)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [initialPosts.length]);

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-content mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-6">
          {t("home.latestTitle")}
        </h2>
        {loading ? (
          <div className="py-8 text-center text-slate-500">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="py-8 text-center text-slate-500">No posts yet.</div>
        ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/research/${post.slug}`}
              className="block p-4 rounded-xl border border-slate-200 bg-white hover:border-accent-orange/50 hover:shadow-sm transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="font-medium text-slate-900">
                  {getPostTitle(post, locale)}
                </h3>
                <span className="text-sm text-slate-500 shrink-0">
                  {typeof post.date === "string"
                    ? post.date.includes("T")
                      ? new Date(post.date).toLocaleDateString()
                      : post.date
                    : new Date(post.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1 line-clamp-1">
                {getPostSummary(post, locale)}
              </p>
            </Link>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
