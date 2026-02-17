"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ResearchCard } from "../ResearchCard";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { Post } from "@/lib/research/types";

interface FeaturedResearchSectionProps {
  initialPosts?: Post[];
}

export function FeaturedResearchSection({
  initialPosts = [],
}: FeaturedResearchSectionProps = {}) {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(initialPosts.length === 0);

  useEffect(() => {
    if (initialPosts.length > 0) return;
    fetch("/api/posts")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Post[]) => setPosts(data.slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [initialPosts.length]);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-content mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
          {t("home.featuredTitle")}
        </h2>
        <p className="text-slate-600 mb-10 max-w-2xl">
          {t("home.featuredDesc")}
        </p>
        {loading ? (
          <div className="py-8 text-center text-slate-500">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="py-8 text-center text-slate-500">No posts yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <ResearchCard key={post.id} post={post} />
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Link
            href="/research"
            className="font-medium text-accent-orange hover:underline"
          >
            {t("home.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
