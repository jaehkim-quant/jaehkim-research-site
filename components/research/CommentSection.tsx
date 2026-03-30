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
    "bg-accent-orange",
    "bg-accent-blue",
    "bg-emerald-500",
    "bg-amber-400",
    "bg-cyan-500",
    "bg-fuchsia-500",
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
      <div className={compact ? "grid gap-3 md:grid-cols-[160px_minmax(0,1fr)]" : ""}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("research.commentNamePlaceholder")}
          required
          maxLength={50}
          className="terminal-input py-3 text-sm"
        />
        {compact && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("research.replyPlaceholder")}
            required
            maxLength={2000}
            rows={2}
            className="terminal-textarea text-sm"
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
          rows={4}
          className="terminal-textarea text-sm"
        />
      )}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={status === "posting"}
          className={`${compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"} terminal-primary-button font-label uppercase tracking-[0.18em] disabled:opacity-50`}
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
            className={`${compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"} terminal-outline-button`}
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
    <div className="flex gap-3">
      <div
        className={`${avatarColor} ${isReply ? "h-8 w-8 text-[10px]" : "h-10 w-10 text-xs"} flex shrink-0 items-center justify-center rounded-full font-semibold text-[#140d08]`}
      >
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className={`font-semibold text-text-title ${isReply ? "text-xs" : "text-sm"}`}>
            {comment.name}
          </span>
          <span className="terminal-label text-[0.58rem] text-text-dark">
            {timeAgo(comment.createdAt)}
          </span>
        </div>

        <p className={`whitespace-pre-wrap text-text-dark ${isReply ? "text-xs" : "text-sm"}`}>
          {comment.content}
        </p>

        {!isReply && (
          <button
            type="button"
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="mt-3 terminal-label text-[0.58rem] text-accent-orange hover:text-accent-orange/80"
          >
            {showReplyForm ? t("research.cancel") : t("research.reply")}
          </button>
        )}

        {showReplyForm && (
          <div className="mt-4">
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
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <div className="terminal-label mb-2">Discussion</div>
          <h3 className="terminal-heading text-2xl text-text-title">
            {t("research.comments")} ({totalCount})
          </h3>
        </div>
      </div>

      <div className="terminal-surface rounded-sm p-5">
        <CommentForm
          postId={postId}
          onSubmit={(comment) => onCommentAdded(comment as Comment)}
        />
      </div>

      {totalCount === 0 ? (
        <p className="py-12 text-center text-sm text-text-dark">
          {t("research.commentEmpty")}
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="terminal-surface rounded-sm p-5">
              <CommentItem
                comment={comment}
                postId={postId}
                onReplyAdded={(reply) => onCommentAdded(reply, comment.id)}
              />

              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-6 mt-5 space-y-3 border-l border-border pl-5 md:ml-12">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="terminal-surface rounded-sm p-4">
                      <CommentItem comment={reply} postId={postId} isReply />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
