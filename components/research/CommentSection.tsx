"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface Reply {
  id: string;
  name: string;
  content: string;
  parentId: string;
  createdAt: string;
}

interface Comment {
  id: string;
  name: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  replies: Reply[];
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onCommentAdded: (comment: Comment | Reply, parentId?: string) => void;
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string) {
  const colors = [
    "bg-orange-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-cyan-500",
    "bg-amber-500",
    "bg-indigo-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function timeAgo(dateStr: string) {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 30) return `${days}일 전`;
  return new Date(dateStr).toLocaleDateString("ko-KR");
}

function CommentForm({
  postId,
  parentId,
  onSubmit,
  onCancel,
  compact,
}: {
  postId: string;
  parentId?: string;
  onSubmit: (comment: Comment | Reply) => void;
  onCancel?: () => void;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "posting">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setStatus("posting");

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          content: content.trim(),
          parentId: parentId || null,
        }),
      });
      if (res.ok) {
        const newComment = await res.json();
        onSubmit({ ...newComment, replies: [] });
        setContent("");
        if (parentId) setName("");
      }
    } catch {
      /* ignore */
    }
    setStatus("idle");
  };

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-3" : "space-y-4"}>
      <div className={compact ? "flex gap-3" : ""}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("research.commentNamePlaceholder")}
          required
          maxLength={50}
          className={`${
            compact ? "w-40" : "w-full"
          } px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-orange/50 focus:border-accent-orange`}
        />
        {compact && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("research.replyPlaceholder")}
            required
            maxLength={2000}
            rows={1}
            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-orange/50 focus:border-accent-orange resize-none"
          />
        )}
      </div>
      {!compact && (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("research.commentContentPlaceholder")}
          required
          maxLength={2000}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-orange/50 focus:border-accent-orange resize-none"
        />
      )}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={status === "posting"}
          className={`${
            compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
          } rounded-lg bg-accent-orange text-white font-medium hover:bg-accent-orange/90 transition-colors disabled:opacity-50`}
        >
          {status === "posting"
            ? t("research.commentSubmitting")
            : parentId
            ? t("research.reply")
            : t("research.commentSubmit")}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`${
              compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
            } rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors`}
          >
            {t("research.cancel")}
          </button>
        )}
      </div>
    </form>
  );
}

function CommentItem({
  comment,
  postId,
  isReply,
  onReplyAdded,
}: {
  comment: Comment | Reply;
  postId: string;
  isReply?: boolean;
  onReplyAdded?: (reply: Reply) => void;
}) {
  const { t } = useTranslation();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const initials = getInitials(comment.name);
  const avatarColor = getAvatarColor(comment.name);

  return (
    <div className={`flex gap-3 ${isReply ? "" : ""}`}>
      {/* Avatar */}
      <div
        className={`${avatarColor} ${
          isReply ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs"
        } rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
      >
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`font-semibold text-slate-900 ${
              isReply ? "text-xs" : "text-sm"
            }`}
          >
            {comment.name}
          </span>
          <span className="text-xs text-slate-400">
            {timeAgo(comment.createdAt)}
          </span>
        </div>

        {/* Content */}
        <p
          className={`text-slate-700 whitespace-pre-wrap ${
            isReply ? "text-xs" : "text-sm"
          }`}
        >
          {comment.content}
        </p>

        {/* Reply button (only for top-level) */}
        {!isReply && (
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="mt-2 text-xs font-medium text-slate-400 hover:text-accent-orange transition-colors"
          >
            {showReplyForm ? t("research.cancel") : t("research.reply")}
          </button>
        )}

        {/* Inline reply form */}
        {showReplyForm && (
          <div className="mt-3">
            <CommentForm
              postId={postId}
              parentId={comment.id}
              compact
              onSubmit={(reply) => {
                onReplyAdded?.(reply as Reply);
                setShowReplyForm(false);
              }}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function CommentSection({
  postId,
  comments,
  onCommentAdded,
}: CommentSectionProps) {
  const { t } = useTranslation();

  const totalCount =
    comments.length +
    comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0);

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 mb-6">
        {t("research.comments")} ({totalCount})
      </h3>

      {/* Top-level comment form */}
      <div className="mb-8 p-5 rounded-xl border border-slate-200 bg-slate-50/50">
        <CommentForm
          postId={postId}
          onSubmit={(comment) => onCommentAdded(comment as Comment)}
        />
      </div>

      {/* Comments list */}
      {totalCount === 0 ? (
        <p className="text-slate-400 text-sm py-12 text-center">
          {t("research.commentEmpty")}
        </p>
      ) : (
        <div className="space-y-0">
          {comments.map((comment) => (
            <div key={comment.id}>
              {/* Top-level comment */}
              <div className="py-5 border-b border-slate-100 last:border-b-0">
                <CommentItem
                  comment={comment}
                  postId={postId}
                  onReplyAdded={(reply) =>
                    onCommentAdded(reply, comment.id)
                  }
                />

                {/* Replies thread */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-12 mt-3 pl-4 border-l-2 border-slate-200 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="py-2">
                        <CommentItem
                          comment={reply}
                          postId={postId}
                          isReply
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
