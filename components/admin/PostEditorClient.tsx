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
    <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2 bg-slate-50">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === "write"
                ? "bg-white border border-slate-300 text-slate-900"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === "preview"
                ? "bg-white border border-slate-300 text-slate-900"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Preview
          </button>
        </div>
        <span className="text-xs text-slate-500">Cmd/Ctrl + S: Save draft</span>
      </div>

      {activeTab === "write" ? (
        <div
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
              e.preventDefault();
              onSave?.();
            }
          }}
          className="min-h-[340px]"
        >
          <MDXEditor
            ref={editorRef}
            markdown={markdown}
            placeholder={placeholder || "Start writing..."}
            contentEditableClassName="markdown-body p-4 min-h-[300px] focus:outline-none text-slate-700"
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
        <div className="p-4 min-h-[340px]">
          <MarkdownRenderer
            markdown={markdown}
            className="text-slate-700"
          />
        </div>
      )}

      {uploadError && (
        <p className="border-t border-slate-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          {uploadError}
        </p>
      )}
    </div>
  );
}
