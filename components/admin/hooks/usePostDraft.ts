"use client";

import { useEffect, useState } from "react";

interface DraftPayload<TForm> {
  form?: TForm;
  tagsInput?: string;
  savedAt?: string;
}

interface DraftRestoreData<TForm> {
  form: Partial<TForm>;
  tagsInput: string;
  savedAt: string | null;
}

interface UsePostDraftParams<TForm> {
  storageKey: string;
  form: TForm;
  tagsInput: string;
  onRestore: (data: DraftRestoreData<TForm>) => void;
  saveDelayMs?: number;
}

export function usePostDraft<TForm>({
  storageKey,
  form,
  tagsInput,
  onRestore,
  saveDelayMs = 700,
}: UsePostDraftParams<TForm>) {
  const [draftRestored, setDraftRestored] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;

      const draft = JSON.parse(raw) as DraftPayload<TForm>;
      if (!draft.form) return;

      onRestore({
        form: draft.form as Partial<TForm>,
        tagsInput:
          typeof draft.tagsInput === "string"
            ? draft.tagsInput
            : Array.isArray((draft.form as Record<string, unknown>).tags)
              ? (
                  ((draft.form as Record<string, unknown>).tags as string[]) ||
                  []
                ).join(", ")
              : "",
        savedAt: draft.savedAt ?? null,
      });

      setDraftRestored(true);
      if (draft.savedAt) setLastSavedAt(draft.savedAt);
    } catch {
      // Ignore malformed draft payloads
    }
  }, [storageKey, onRestore]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedAt = new Date().toISOString();
        localStorage.setItem(
          storageKey,
          JSON.stringify({ form, tagsInput, savedAt })
        );
        setLastSavedAt(savedAt);
      } catch {
        // Ignore storage failures (private mode/quota)
      }
    }, saveDelayMs);

    return () => clearTimeout(timer);
  }, [form, tagsInput, storageKey, saveDelayMs]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // No-op
    }
  };

  return { draftRestored, lastSavedAt, clearDraft };
}
