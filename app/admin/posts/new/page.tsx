"use client";

import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div className="space-y-4">
      <section className="terminal-card p-6 md:p-8">
        <div className="terminal-label mb-3">Create Packet</div>
        <h1 className="terminal-title text-4xl text-text-title md:text-5xl">
          New Post
        </h1>
      </section>
      <PostForm mode="create" />
    </div>
  );
}
