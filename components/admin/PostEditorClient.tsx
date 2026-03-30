"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  ListsToggle,
  MDXEditor,
  MDXEditorMethods,
  Separator,
  StrikeThroughSupSubToggles,
  UndoRedo,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";

interface PostEditorClientProps {
  markdown: string;
  onChange: (markdown: string) => void;
  onSave?: () => void;
  placeholder?: string;
}

export function PostEditorClient({
  markdown,
  onChange,
  onSave,
  placeholder,
}: PostEditorClientProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [uploadError, setUploadError] = useState("");
  const editorRef = useRef<MDXEditorMethods>(null);
  const lastSyncedRef = useRef(markdown);

  const imageUploadHandler = useMemo(
    () => async (image: File) => {
      setUploadError("");
      const formData = new FormData();
      formData.set("file", image);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }
      return data.url as string;
    },
    []
  );

  useEffect(() => {
    if (!editorRef.current) return;
    if (markdown === lastSyncedRef.current) return;
    editorRef.current.setMarkdown(markdown);
    lastSyncedRef.current = markdown;
  }, [markdown]);

  return (
    <div className="terminal-editor terminal-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          {(["write", "preview"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-sm px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] ${
                activeTab === tab
                  ? "bg-white/10 text-text-title"
                  : "text-text-dark hover:text-text-title"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <span className="terminal-label text-[0.58rem]">Cmd/Ctrl + S</span>
      </div>

      {activeTab === "write" ? (
        <div
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
              e.preventDefault();
              onSave?.();
            }
          }}
          className="min-h-[380px]"
        >
          <MDXEditor
            ref={editorRef}
            markdown={markdown}
            placeholder={placeholder || "Start writing..."}
            contentEditableClassName="markdown-body markdown-body-light min-h-[320px] bg-[#f8f0e3] px-5 py-5 text-[#1f1610] focus:outline-none"
            onChange={(nextMarkdown) => {
              lastSyncedRef.current = nextMarkdown;
              onChange(nextMarkdown);
            }}
            onError={({ error }) => setUploadError(error)}
            plugins={[
              toolbarPlugin({
                toolbarContents: () => (
                  <>
                    <UndoRedo />
                    <Separator />
                    <BlockTypeSelect />
                    <Separator />
                    <BoldItalicUnderlineToggles />
                    <StrikeThroughSupSubToggles />
                    <CodeToggle />
                    <Separator />
                    <ListsToggle />
                    <Separator />
                    <CreateLink />
                    <InsertImage />
                    <InsertTable />
                  </>
                ),
              }),
              headingsPlugin(),
              listsPlugin(),
              quotePlugin(),
              thematicBreakPlugin(),
              linkPlugin(),
              linkDialogPlugin(),
              tablePlugin(),
              imagePlugin({ imageUploadHandler }),
              markdownShortcutPlugin(),
            ]}
          />
        </div>
      ) : (
        <div className="min-h-[380px] bg-[#f8f0e3] px-5 py-5">
          <MarkdownRenderer markdown={markdown} className="markdown-body-light" />
        </div>
      )}

      {uploadError && (
        <p className="border-t border-border bg-[rgba(255,180,171,0.08)] px-4 py-3 text-xs text-[var(--terminal-danger)]">
          {uploadError}
        </p>
      )}
    </div>
  );
}
