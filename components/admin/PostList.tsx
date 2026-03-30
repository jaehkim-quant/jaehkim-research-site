"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  level: string;
  date: string;
  updatedAt: string;
}

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/posts?all=true");

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("Unauthorized. Please sign in again.");
        }
        throw new Error(`Request failed (${res.status})`);
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format");
      }

      setPosts(data);
    } catch (error) {
      setPosts([]);
      setErrorMessage(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
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
          ...post,
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
      <div className="terminal-card px-6 py-16 text-center text-text-dark">
        Loading posts...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="terminal-card px-6 py-16 text-center">
        <p className="mb-2 text-[var(--terminal-danger)]">Failed to load posts</p>
        <p className="mb-4 text-sm text-text-dark">{errorMessage}</p>
        <button
          type="button"
          onClick={fetchPosts}
          className="terminal-outline-button px-4 py-3 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="terminal-card px-6 py-16 text-center">
        <p className="mb-4 text-text-dark">No posts yet</p>
        <Link
          href="/admin/posts/new"
          className="terminal-primary-button font-label text-xs uppercase tracking-[0.2em]"
        >
          Create First Post
        </Link>
      </div>
    );
  }

  return (
    <div className="terminal-card overflow-hidden p-4 md:p-5">
      <table className="terminal-table">
        <thead>
          <tr>
            <th>Title</th>
            <th className="hidden md:table-cell">Status</th>
            <th className="hidden md:table-cell">Level</th>
            <th className="hidden lg:table-cell">Date</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>
                <div className="space-y-1">
                  <p className="font-medium text-text-title">{post.title}</p>
                  <p className="text-xs text-text-dark">{post.slug}</p>
                </div>
              </td>
              <td className="hidden md:table-cell">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(post)}
                  className={`terminal-badge ${post.published ? "terminal-badge-amber" : "terminal-badge-neutral"}`}
                >
                  {post.published ? "Published" : "Draft"}
                </button>
              </td>
              <td className="hidden md:table-cell text-sm text-text-dark">
                {post.level}
              </td>
              <td className="hidden lg:table-cell text-sm text-text-dark">
                {new Date(post.date).toLocaleDateString("ko-KR")}
              </td>
              <td>
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="terminal-outline-button px-3 py-2 text-xs"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(post.id, post.title)}
                    className="terminal-outline-button px-3 py-2 text-xs text-[var(--terminal-danger)]"
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
