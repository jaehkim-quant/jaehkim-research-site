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
      <p className="text-slate-500 py-8">댓글 목록을 불러오는 중...</p>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">댓글 관리</h1>
        <p className="text-sm text-slate-500">{comments.length}개 댓글</p>
      </div>

      {comments.length === 0 ? (
        <p className="text-slate-500 py-16 text-center">
          아직 댓글이 없습니다.
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-slate-200 rounded-lg bg-white"
            >
              <div
                className="flex items-start gap-4 px-5 py-4 cursor-pointer"
                onClick={() =>
                  setExpandedId(expandedId === comment.id ? null : comment.id)
                }
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-slate-900">
                      {comment.name}
                    </span>
                    {comment.parent && (
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        답글
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <Link
                      href={`/research/${comment.post.slug}`}
                      className="text-xs text-orange-600 hover:text-orange-700 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {comment.post.title}
                    </Link>
                    <span className="text-xs text-slate-400">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${
                    expandedId === comment.id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {expandedId === comment.id && (
                <div className="px-5 pb-5 border-t border-slate-100">
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    {comment.parent && (
                      <div className="mb-3 pb-3 border-b border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">
                          답글 대상: {comment.parent.name}
                        </p>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {comment.parent.content}
                        </p>
                      </div>
                    )}
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <Link
                      href={`/research/${comment.post.slug}#comments`}
                      className="text-sm px-3 py-1.5 rounded bg-orange-500 text-white hover:bg-orange-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      글에서 보기
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(comment.id);
                      }}
                      className="text-sm px-3 py-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50 ml-auto"
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
