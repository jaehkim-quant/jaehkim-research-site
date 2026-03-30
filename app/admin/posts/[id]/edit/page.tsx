"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";

export default function EditPostPage() {
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) throw new Error("Post not found");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="terminal-card px-6 py-16 text-center text-text-dark">
        Loading...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="terminal-card px-6 py-16 text-center text-[var(--terminal-danger)]">
        {error || "Post not found"}
      </div>
    );
  }

  const initialData = {
    id: post.id as string,
    title: (post.title as string) || "",
    slug: (post.slug as string) || "",
    summary: (post.summary as string) || "",
    content: (post.content as string) || "",
    tags: (post.tags as string[]) || [],
    level: (post.level as string) || "중급",
    published: (post.published as boolean) || false,
    date: post.date
      ? new Date(post.date as string).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    seriesId: (post.seriesId as string) || "",
    seriesOrder: post.seriesOrder != null ? String(post.seriesOrder) : "",
  };

  return (
    <div className="space-y-4">
      <section className="terminal-card p-6 md:p-8">
        <div className="terminal-label mb-3">Edit Packet</div>
        <h1 className="terminal-title text-4xl text-text-title md:text-5xl">
          Edit Post
        </h1>
      </section>
      <PostForm mode="edit" initialData={initialData} />
    </div>
  );
}
