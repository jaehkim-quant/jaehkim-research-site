"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAutoSlug } from "./hooks/useAutoSlug";

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
  const { slugGenerating, generateSlug } = useAutoSlug("/api/series?all=true");

  const [form, setForm] = useState<SeriesData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    type: initialData?.type || "knowledge-base",
    level: initialData?.level || "중급",
    published: initialData?.published ?? false,
  });

  const handleAutoSlug = async () => {
    setError("");
    const slug = await generateSlug();
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
    <div className="space-y-4">
      <section className="terminal-card p-6 md:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="제목">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="terminal-input"
              placeholder="시리즈 제목"
            />
          </Field>

          <Field label="Type">
            <select
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
              className="terminal-select"
            >
              <option value="knowledge-base">Knowledge</option>
              <option value="book-notes">Book</option>
            </select>
          </Field>

          <Field label="URL Slug" className="md:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                className="terminal-input flex-1"
                placeholder="series-slug"
              />
              <button
                type="button"
                onClick={handleAutoSlug}
                disabled={slugGenerating}
                className="terminal-outline-button px-4 py-3 text-sm"
              >
                {slugGenerating ? "Generating..." : "Auto"}
              </button>
            </div>
          </Field>

          <Field label="설명" className="md:col-span-2">
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="terminal-textarea"
              placeholder="시리즈 설명"
            />
          </Field>

          <Field label="Level">
            <select
              value={form.level}
              onChange={(e) => setForm((prev) => ({ ...prev, level: e.target.value }))}
              className="terminal-select"
            >
              <option value="초급">Beginner</option>
              <option value="중급">Intermediate</option>
              <option value="고급">Advanced</option>
            </select>
          </Field>
        </div>
      </section>

      {error && (
        <p className="rounded-sm border border-[rgba(255,180,171,0.3)] bg-[rgba(255,180,171,0.08)] px-4 py-3 text-sm text-[var(--terminal-danger)]">
          {error}
        </p>
      )}

      <div className="terminal-card flex flex-wrap gap-3 px-6 py-5">
        <button
          type="button"
          onClick={() => handleSave(false)}
          disabled={saving}
          className="terminal-outline-button px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save as Draft"}
        </button>
        <button
          type="button"
          onClick={() => handleSave(true)}
          disabled={saving}
          className="terminal-primary-button px-4 py-3 font-label text-xs uppercase tracking-[0.2em] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Publishing..." : "Publish"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/series")}
          className="terminal-outline-button px-4 py-3 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="terminal-label mb-2 block text-[0.66rem]">{label}</label>
      {children}
    </div>
  );
}
