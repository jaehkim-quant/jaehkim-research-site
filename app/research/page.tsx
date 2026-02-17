"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ResearchCard } from "@/components/research/ResearchCard";
import { SearchBar } from "@/components/research/SearchBar";
import { FilterChips } from "@/components/research/FilterChips";
import { postsMock } from "@/lib/research/data/posts.mock";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { TAG_LIST, getTagLabel } from "@/lib/research/data/tagLabels";
import { getPostTitle, getPostSummary, getPostTags } from "@/lib/research/postLocale";
import type { Post } from "@/lib/research/types";

function ResearchContent() {
  const searchParams = useSearchParams();
  const tagFromUrl = searchParams.get("tag");
  const { t, locale } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>(postsMock);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setPosts(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!tagFromUrl) return;
    const isKey = TAG_LIST.some((x) => x.key === tagFromUrl);
    const label = isKey ? getTagLabel(tagFromUrl, locale) : tagFromUrl;
    setSelectedTags((prev) => (prev.includes(label) ? prev : [label]));
  }, [tagFromUrl, locale]);

  const filtered = useMemo(() => {
    let result = posts;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => {
        const title = getPostTitle(p, locale);
        const summary = getPostSummary(p, locale);
        const tags = getPostTags(p, locale);
        return (
          title.toLowerCase().includes(q) ||
          summary.toLowerCase().includes(q) ||
          tags.some((tag) => tag.toLowerCase().includes(q))
        );
      });
    }
    if (selectedTags.length > 0) {
      result = result.filter((p) => {
        const tags = getPostTags(p, locale);
        return selectedTags.some((sel) => tags.includes(sel));
      });
    }
    return result;
  }, [search, selectedTags, locale, posts]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="max-w-content mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
          {t("research.title")}
        </h1>
        <p className="text-slate-600 mb-10 max-w-2xl">{t("research.desc")}</p>

        <div className="flex flex-col gap-6 mb-10">
          <SearchBar value={search} onChange={setSearch} />
          <FilterChips selected={selectedTags} onToggle={toggleTag} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <ResearchCard key={post.id} post={post} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-slate-500 py-16">
            {t("research.noResults")}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ResearchLibraryPage() {
  const { t } = useTranslation();

  return (
    <Suspense
      fallback={
        <div className="py-16 md:py-24 max-w-content mx-auto px-6">
          {t("research.loading")}
        </div>
      }
    >
      <ResearchContent />
    </Suspense>
  );
}
