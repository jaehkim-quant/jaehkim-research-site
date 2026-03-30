"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { PostEditor } from "./PostEditor";
import { useAutoSlug } from "./hooks/useAutoSlug";
import { usePostDraft } from "./hooks/usePostDraft";
import { useSeriesOptions } from "./hooks/useSeriesOptions";

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

interface PostFormProps {
  initialData?: PostData;
  mode: "create" | "edit";
}

export function PostForm({ initialData, mode }: PostFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const seriesOptions = useSeriesOptions();
  const draftStorageKey =
    mode === "edit" && initialData?.id
      ? `post-form-draft:${initialData.id}`
      : "post-form-draft:new";
  const { slugGenerating, generateSlug } = useAutoSlug("/api/posts?all=true");

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

  const handleRestoreDraft = useCallback(
    ({
      form: restoredForm,
      tagsInput: restoredTagsInput,
    }: {
      form: Partial<PostData>;
      tagsInput: string;
      savedAt: string | null;
    }) => {
      setForm((prev) => ({ ...prev, ...restoredForm }));
      setTagsInput(restoredTagsInput);
    },
    []
  );

  const { draftRestored, lastSavedAt, clearDraft } = usePostDraft({
    storageKey: draftStorageKey,
    form,
    tagsInput,
    onRestore: handleRestoreDraft,
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

      clearDraft();
      router.push("/admin");
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
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="terminal-input"
              placeholder="게시글 제목"
            />
          </Field>

          <Field label="Level">
            <select
              value={form.level}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, level: e.target.value }))
              }
              className="terminal-select"
            >
              <option value="초급">Beginner</option>
              <option value="중급">Intermediate</option>
              <option value="고급">Advanced</option>
            </select>
          </Field>

          <Field label="URL Slug" className="md:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="terminal-input flex-1"
                placeholder="url-slug"
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

          <Field label="요약" className="md:col-span-2">
            <textarea
              value={form.summary}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, summary: e.target.value }))
              }
              rows={4}
              className="terminal-textarea"
              placeholder="게시글 요약을 입력하세요"
            />
          </Field>
        </div>
      </section>

      <section className="terminal-card p-6 md:p-8">
        <div className="terminal-label mb-4">Content Body</div>
        <PostEditor
          markdown={form.content}
          onChange={(markdown) =>
            setForm((prev) => ({ ...prev, content: markdown }))
          }
          onSave={() => handleSave(false)}
          placeholder="본문을 작성하세요..."
        />
        <p className="mt-4 text-sm text-text-dark">
          {draftRestored && "초안을 복구했습니다. "}
          {lastSavedAt
            ? `자동 저장: ${new Date(lastSavedAt).toLocaleTimeString()}`
            : "자동 저장 대기 중..."}
        </p>
      </section>

      <section className="terminal-card p-6 md:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="태그" className="md:col-span-2">
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="terminal-input"
              placeholder="쉼표로 구분: tag1, tag2, tag3"
            />
          </Field>

          <Field label="Date">
            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, date: e.target.value }))
              }
              className="terminal-input"
            />
          </Field>

          <Field label="Series (Optional)">
            <select
              value={form.seriesId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, seriesId: e.target.value }))
              }
              className="terminal-select"
            >
              <option value="">None (No series)</option>
              {seriesOptions.map((series) => (
                <option key={series.id} value={series.id}>
                  {series.title}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-text-dark">
              Posts assigned to a series still appear in Research.
            </p>
          </Field>

          {form.seriesId && (
            <Field label="Chapter Order">
              <input
                type="number"
                min="1"
                value={form.seriesOrder}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, seriesOrder: e.target.value }))
                }
                className="terminal-input"
                placeholder="1"
              />
            </Field>
          )}
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
          onClick={() => router.push("/admin")}
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
