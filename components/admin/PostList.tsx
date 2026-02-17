"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Post {
  id: string;
  title: string;
  titleEn: string | null;
  slug: string;
  published: boolean;
  level: string;
  date: string;
  updatedAt: string;
}

export function PostList() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts?all=true");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleTogglePublish = async (post: Post) => {
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          summary: "",
          published: !post.published,
        }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === post.id ? { ...p, published: !p.published } : p
          )
        );
      }
    } catch (error) {
      console.error("Toggle publish failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-slate-500">Loading posts...</div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 mb-4">No posts yet</p>
        <Link
          href="/admin/posts/new"
          className="inline-flex px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
        >
          Create First Post
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">
              Title
            </th>
            <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3 hidden md:table-cell">
              Status
            </th>
            <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3 hidden md:table-cell">
              Level
            </th>
            <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3 hidden sm:table-cell">
              Date
            </th>
            <th className="text-right text-xs font-medium text-slate-500 uppercase px-4 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr
              key={post.id}
              className="border-b border-slate-100 hover:bg-slate-50"
            >
              <td className="px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {post.title}
                  </p>
                  {post.titleEn && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {post.titleEn}
                    </p>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <button
                  onClick={() => handleTogglePublish(post)}
                  className={`inline-flex items-center text-xs px-2 py-1 rounded-full font-medium ${
                    post.published
                      ? "bg-green-50 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {post.published ? "Published" : "Draft"}
                </button>
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <span className="text-sm text-slate-600">{post.level}</span>
              </td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <span className="text-sm text-slate-500">
                  {new Date(post.date).toLocaleDateString()}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex gap-2 justify-end">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="text-xs px-2 py-1 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
