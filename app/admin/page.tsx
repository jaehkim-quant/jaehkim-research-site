"use client";

import Link from "next/link";
import { PostList } from "@/components/admin/PostList";

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
        >
          + New Post
        </Link>
      </div>
      <PostList />
    </div>
  );
}
