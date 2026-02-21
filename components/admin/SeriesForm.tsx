"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SeriesData {
  id?: string;
  title: string;
  slug: string;
  description: string;
  type: string;
  level: string;
  published: boolean;
}

interface SeriesFormProps {
  initialData?: SeriesData;
  mode: "create" | "edit";
}

export function SeriesForm({ initialData, mode }: SeriesFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<SeriesData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    type: initialData?.type || "knowledge-base",
    level: initialData?.level || "중급",
    published: initialData?.published ?? false,
  });

  const generateSlug = () => {
    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/(^-|-$)/g, "");
    setForm((prev) => ({ ...prev, slug }));
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

    const body = { ...form, published: publish };

    try {
      const url =
        mode === "edit" && initialData?.id
          ? `/api/series/${initialData.id}`
          : "/api/series";
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

      router.push("/admin/series");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          제목
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="시리즈 제목"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          URL Slug
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="series-slug"
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

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          설명
        </label>
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
          placeholder="시리즈 설명"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Type
          </label>
          <select
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="knowledge-base">Knowledge Base</option>
            <option value="book-notes">Book Notes</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Level
          </label>
          <select
            value={form.level}
            onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="초급">Beginner</option>
            <option value="중급">Intermediate</option>
            <option value="고급">Advanced</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

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
          onClick={() => router.push("/admin/series")}
          className="px-4 py-2 text-slate-500 text-sm hover:text-slate-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
