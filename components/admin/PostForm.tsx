"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RichEditor } from "./RichEditor";

interface PostData {
  id?: string;
  title: string;
  titleEn: string;
  slug: string;
  summary: string;
  summaryEn: string;
  content: string;
  contentEn: string;
  tags: string[];
  tagsEn: string[];
  level: string;
  published: boolean;
  date: string;
  seriesId: string;
  seriesOrder: string;
}

interface SeriesOption {
  id: string;
  title: string;
  titleEn?: string;
}

interface PostFormProps {
  initialData?: PostData;
  mode: "create" | "edit";
}

export function PostForm({ initialData, mode }: PostFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"ko" | "en">("ko");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [seriesOptions, setSeriesOptions] = useState<SeriesOption[]>([]);

  useEffect(() => {
    fetch("/api/series?all=true")
      .then((res) => res.json())
      .then((data) => setSeriesOptions(data))
      .catch(() => {});
  }, []);

  const [form, setForm] = useState<PostData>({
    title: initialData?.title || "",
    titleEn: initialData?.titleEn || "",
    slug: initialData?.slug || "",
    summary: initialData?.summary || "",
    summaryEn: initialData?.summaryEn || "",
    content: initialData?.content || "",
    contentEn: initialData?.contentEn || "",
    tags: initialData?.tags || [],
    tagsEn: initialData?.tagsEn || [],
    level: initialData?.level || "중급",
    published: initialData?.published ?? false,
    date: initialData?.date || new Date().toISOString().split("T")[0],
    seriesId: initialData?.seriesId || "",
    seriesOrder: initialData?.seriesOrder || "",
  });

  const [tagsInput, setTagsInput] = useState(form.tags.join(", "));
  const [tagsEnInput, setTagsEnInput] = useState(form.tagsEn.join(", "));

  const generateSlug = () => {
    const source = form.titleEn || form.title;
    const slug = source
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/(^-|-$)/g, "");
    setForm((prev) => ({ ...prev, slug }));
  };

  const handleSave = async (publish: boolean) => {
    if (!form.title) {
      setError("Title (Korean) is required");
      return;
    }
    if (!form.slug) {
      setError("Slug is required");
      return;
    }

    setSaving(true);
    setError("");

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const tagsEn = tagsEnInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const body = {
      ...form,
      tags,
      tagsEn,
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

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Language tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("ko")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === "ko"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Korean
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("en")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === "en"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          English
        </button>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {activeTab === "ko" ? "Title (Korean)" : "Title (English)"}
        </label>
        <input
          type="text"
          value={activeTab === "ko" ? form.title : form.titleEn}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              [activeTab === "ko" ? "title" : "titleEn"]: e.target.value,
            }))
          }
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder={
            activeTab === "ko" ? "게시글 제목" : "Post title in English"
          }
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
            className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors"
          >
            Auto
          </button>
        </div>
      </div>

      {/* Summary */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {activeTab === "ko" ? "Summary (Korean)" : "Summary (English)"}
        </label>
        <textarea
          value={activeTab === "ko" ? form.summary : form.summaryEn}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              [activeTab === "ko" ? "summary" : "summaryEn"]: e.target.value,
            }))
          }
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y"
          placeholder={
            activeTab === "ko"
              ? "게시글 요약을 입력하세요"
              : "Brief summary in English"
          }
        />
      </div>

      {/* Content (Rich Editor) */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {activeTab === "ko" ? "Content (Korean)" : "Content (English)"}
        </label>
        {activeTab === "ko" ? (
          <RichEditor
            content={form.content}
            onChange={(html) =>
              setForm((prev) => ({ ...prev, content: html }))
            }
            placeholder="본문을 작성하세요..."
          />
        ) : (
          <RichEditor
            content={form.contentEn}
            onChange={(html) =>
              setForm((prev) => ({ ...prev, contentEn: html }))
            }
            placeholder="Write content in English..."
          />
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {activeTab === "ko" ? "Tags (Korean)" : "Tags (English)"}
        </label>
        <input
          type="text"
          value={activeTab === "ko" ? tagsInput : tagsEnInput}
          onChange={(e) =>
            activeTab === "ko"
              ? setTagsInput(e.target.value)
              : setTagsEnInput(e.target.value)
          }
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Comma separated: tag1, tag2, tag3"
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
                {s.title}{s.titleEn ? ` / ${s.titleEn}` : ""}
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
