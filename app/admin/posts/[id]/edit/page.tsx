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
    return <div className="py-12 text-center text-slate-500">Loading...</div>;
  }

  if (error || !post) {
    return (
      <div className="py-12 text-center text-red-600">
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
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Post</h1>
      <PostForm mode="edit" initialData={initialData} />
    </div>
  );
}
