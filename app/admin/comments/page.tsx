"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface CommentWithPost {
  id: string;
  postId: string;
  parentId: string | null;
  name: string;
  content: string;
  createdAt: string;
  post: { id: string; title: string; slug: string };
  parent: { id: string; name: string; content: string } | null;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<CommentWithPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/comments")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setComments(data))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("이 댓글을 삭제할까요? 답글도 함께 삭제됩니다.")) return;
    const res = await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert("삭제에 실패했습니다.");
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="terminal-card px-6 py-16 text-center text-text-dark">
        댓글 목록을 불러오는 중...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="terminal-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="terminal-label mb-3">Comment Control</div>
            <h1 className="terminal-title text-4xl text-text-title md:text-5xl">
              댓글 관리
            </h1>
          </div>
          <span className="terminal-label text-[0.66rem]">
            {comments.length}개 댓글
          </span>
        </div>
      </section>

      {comments.length === 0 ? (
        <div className="terminal-card px-6 py-16 text-center text-text-dark">
          아직 댓글이 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="terminal-card">
              <div
                className="flex cursor-pointer items-start gap-4 px-5 py-5"
                onClick={() =>
                  setExpandedId(expandedId === comment.id ? null : comment.id)
                }
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="font-medium text-text-title">
                      {comment.name}
                    </span>
                    {comment.parent && (
                      <span className="terminal-badge terminal-badge-blue">답글</span>
                    )}
                  </div>
                  <p className="line-clamp-2 text-sm text-text-dark">
                    {comment.content}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/research/${comment.post.slug}`}
                      className="terminal-label text-[0.58rem] text-accent-orange hover:text-accent-orange/80"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {comment.post.title}
                    </Link>
                    <span className="terminal-label text-[0.58rem]">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                </div>
                <span className="terminal-number text-sm text-text-dark">
                  {expandedId === comment.id ? "−" : "+"}
                </span>
              </div>

              {expandedId === comment.id && (
                <div className="border-t border-border px-5 pb-5">
                  <div className="mt-4 rounded-sm bg-white/4 p-4">
                    {comment.parent && (
                      <div className="mb-3 border-b border-border pb-3">
                        <p className="terminal-label mb-2 text-[0.58rem]">
                          답글 대상: {comment.parent.name}
                        </p>
                        <p className="line-clamp-2 text-sm text-text-dark">
                          {comment.parent.content}
                        </p>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap text-sm text-text-dark">
                      {comment.content}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/research/${comment.post.slug}#comments`}
                      className="terminal-primary-button px-3 py-2 font-label text-xs uppercase tracking-[0.18em]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      글에서 보기
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(comment.id);
                      }}
                      className="terminal-outline-button ml-auto px-3 py-2 text-sm text-[var(--terminal-danger)]"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
