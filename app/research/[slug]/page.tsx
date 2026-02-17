"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { postsMock } from "@/lib/research/data/posts.mock";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getPostTitle, getPostSummary, getPostTags } from "@/lib/research/postLocale";
import type { Post } from "@/lib/research/types";

const levelKeyMap = {
  초급: "beginner",
  중급: "intermediate",
  고급: "advanced",
} as const;

export default function ResearchDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t, locale } = useTranslation();

  const [post, setPost] = useState<Post | null>(
    postsMock.find((p) => p.slug === slug) || null
  );

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Post[]) => {
        const found = data.find((p) => p.slug === slug);
        if (found) setPost(found);
      })
      .catch(() => {});
  }, [slug]);

  if (!post) {
    return (
      <div className="py-16 max-w-content mx-auto px-6">
        <p className="text-slate-600">Not found.</p>
      </div>
    );
  }

  const levelKey = levelKeyMap[post.level as keyof typeof levelKeyMap] ?? "beginner";
  const title = getPostTitle(post, locale);
  const summary = getPostSummary(post, locale);
  const tags = getPostTags(post, locale);
  const content =
    locale === "en" && post.contentEn ? post.contentEn : post.content;

  return (
    <article className="py-16 md:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/research"
          className="text-sm font-medium text-accent-orange hover:underline mb-6 inline-block"
        >
          {t("research.backToLibrary")}
        </Link>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
          {title}
        </h1>
        <div className="flex flex-wrap gap-2 mb-6">
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
          <span className="text-xs text-slate-500">
            {typeof post.date === "string"
              ? post.date.includes("T")
                ? new Date(post.date).toLocaleDateString()
                : post.date
              : new Date(post.date).toLocaleDateString()}
          </span>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 p-6 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              {t("research.summaryTab")}
            </h2>
            <p className="text-slate-600">{summary}</p>
          </div>

          {content ? (
            <div className="rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                {t("research.deepDiveTab")}
              </h2>
              <div
                className="prose prose-sm max-w-none text-slate-700"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                {t("research.deepDiveTab")}
              </h2>
              <p className="text-slate-600">
                {t("research.deepDivePlaceholder")}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
