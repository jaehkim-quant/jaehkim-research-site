"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PostEditor } from "./PostEditor";

const SLUG_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
const SLUG_LENGTH = 12;

function createRandomSlug() {
  const bytes = new Uint8Array(SLUG_LENGTH);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes, (b) => SLUG_ALPHABET[b % SLUG_ALPHABET.length]).join(
    ""
  );
}

interface PostData {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  tags: string[];
  level: string;
  published: boolean;
  date: string;
  seriesId: string;
  seriesOrder: string;
}

interface SeriesOption {
  id: string;
  title: string;
}

interface PostFormProps {
  initialData?: PostData;
  mode: "create" | "edit";
}

export function PostForm({ initialData, mode }: PostFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [draftRestored, setDraftRestored] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [slugGenerating, setSlugGenerating] = useState(false);
  const [seriesOptions, setSeriesOptions] = useState<SeriesOption[]>([]);
  const draftStorageKey =
    mode === "edit" && initialData?.id
      ? `post-form-draft:${initialData.id}`
      : "post-form-draft:new";

  useEffect(() => {
    fetch("/api/series?all=true")
      .then((res) => res.json())
      .then((data) => setSeriesOptions(data))
      .catch(() => {});
  }, []);

  const [form, setForm] = useState<PostData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    summary: initialData?.summary || "",
    content: initialData?.content || "",
    tags: initialData?.tags || [],
    level: initialData?.level || "중급",
    published: initialData?.published ?? false,
    date: initialData?.date || new Date().toISOString().split("T")[0],
    seriesId: initialData?.seriesId || "",
    seriesOrder: initialData?.seriesOrder || "",
  });

  const [tagsInput, setTagsInput] = useState(form.tags.join(", "));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftStorageKey);
      if (!raw) return;
      const draft = JSON.parse(raw) as {
        form?: PostData;
        tagsInput?: string;
        savedAt?: string;
      };
      if (!draft.form) return;
      setForm((prev) => ({ ...prev, ...draft.form }));
      setTagsInput(
        typeof draft.tagsInput === "string"
          ? draft.tagsInput
          : (draft.form.tags || []).join(", ")
      );
      setDraftRestored(true);
      if (draft.savedAt) setLastSavedAt(draft.savedAt);
    } catch {
      // Ignore malformed draft payloads
    }
  }, [draftStorageKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedAt = new Date().toISOString();
        localStorage.setItem(
          draftStorageKey,
          JSON.stringify({ form, tagsInput, savedAt })
        );
        setLastSavedAt(savedAt);
      } catch {
        // Ignore storage failures (private mode/quota)
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [form, tagsInput, draftStorageKey]);

  const generateSlug = async () => {
    setSlugGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/posts?all=true");
      if (!res.ok) throw new Error();
      const posts = (await res.json()) as Array<{ slug?: string }>;
      const existingSlugs = new Set(
        posts
          .map((p) => (typeof p.slug === "string" ? p.slug : ""))
          .filter(Boolean)
      );

      let candidate = createRandomSlug();
      for (let i = 0; i < 8; i += 1) {
        if (!existingSlugs.has(candidate)) break;
        candidate = createRandomSlug();
      }
      setForm((prev) => ({ ...prev, slug: candidate }));
    } catch {
      // Fallback: still generate collision-resistant random slug locally.
      setForm((prev) => ({ ...prev, slug: createRandomSlug() }));
    } finally {
      setSlugGenerating(false);
    }
  };

  const handleSave = async (publish: boolean) => {
    if (!form.title) {
      setError("제목을 입력하세요");
      return;
    }
    if (!form.slug) {
      setError("Slug를 입력하세요");
      return;
    }

    setSaving(true);
    setError("");

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const body = {
      ...form,
      tags,
      published: publish,
      seriesId: form.seriesId || null,
      seriesOrder: form.seriesOrder ? Number(form.seriesOrder) : null,
    };

    try {
      const url =
        mode === "edit" && initialData?.id
          ? `/api/posts/${initialData.id}`
          : "/api/posts";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }

      localStorage.removeItem(draftStorageKey);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          제목
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="게시글 제목"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          URL Slug
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={form.slug}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, slug: e.target.value }))
            }
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="url-slug"
          />
          <button
            type="button"
            onClick={generateSlug}
            disabled={slugGenerating}
            className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 disabled:opacity-50 transition-colors"
          >
            {slugGenerating ? "Generating..." : "Auto"}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          요약
        </label>
        <textarea
          value={form.summary}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, summary: e.target.value }))
          }
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y"
          placeholder="게시글 요약을 입력하세요"
        />
      </div>

      {/* Content (Rich Editor) */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          본문
        </label>
        <PostEditor
          markdown={form.content}
          onChange={(markdown) =>
            setForm((prev) => ({ ...prev, content: markdown }))
          }
          onSave={() => handleSave(false)}
          placeholder="본문을 작성하세요..."
        />
        <p className="mt-2 text-xs text-slate-500">
          {draftRestored && "초안을 복구했습니다. "}
          {lastSavedAt
            ? `자동 저장: ${new Date(lastSavedAt).toLocaleTimeString()}`
            : "자동 저장 대기 중..."}
        </p>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          태그
        </label>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="쉼표로 구분: tag1, tag2, tag3"
        />
      </div>

      {/* Level + Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Level
          </label>
          <select
            value={form.level}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, level: e.target.value }))
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="초급">Beginner</option>
            <option value="중급">Intermediate</option>
            <option value="고급">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, date: e.target.value }))
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Series Assignment */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Series (Knowledge Base)
          </label>
          <select
            value={form.seriesId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, seriesId: e.target.value }))
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">None (Research Library only)</option>
            {seriesOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
        {form.seriesId && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Chapter Order
            </label>
            <input
              type="number"
              min="1"
              value={form.seriesOrder}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, seriesOrder: e.target.value }))
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="1"
            />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => handleSave(false)}
          disabled={saving}
          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save as Draft"}
        </button>
        <button
          type="button"
          onClick={() => handleSave(true)}
          disabled={saving}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Publishing..." : "Publish"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-4 py-2 text-slate-500 text-sm hover:text-slate-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
