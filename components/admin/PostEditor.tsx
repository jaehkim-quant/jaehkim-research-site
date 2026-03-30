"use client";

import dynamic from "next/dynamic";

interface PostEditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
  onSave?: () => void;
  placeholder?: string;
}

const PostEditorClient = dynamic(
  () => import("./PostEditorClient").then((m) => m.PostEditorClient),
  {
    ssr: false,
    loading: () => (
      <div className="terminal-card p-4 text-sm text-text-dark">
        Editor loading...
      </div>
    ),
  }
);

export function PostEditor(props: PostEditorProps) {
  return <PostEditorClient {...props} />;
}
