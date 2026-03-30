"use client";

import Link from "next/link";
import { PostList } from "@/components/admin/PostList";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-4">
      <section className="terminal-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="terminal-label mb-3">Content Operations</div>
            <h1 className="terminal-title text-4xl text-text-title md:text-5xl">
              Posts
            </h1>
            <p className="terminal-copy mt-4 max-w-3xl text-sm md:text-base">
              Create, publish, archive, and revise research notes from a single operator screen.
            </p>
          </div>
          <Link
            href="/admin/posts/new"
            className="terminal-primary-button font-label text-xs uppercase tracking-[0.2em]"
          >
            New Post
          </Link>
        </div>
      </section>

      <PostList />
    </div>
  );
}
