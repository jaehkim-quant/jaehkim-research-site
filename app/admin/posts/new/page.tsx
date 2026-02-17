"use client";

import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">New Post</h1>
      <PostForm mode="create" />
    </div>
  );
}
