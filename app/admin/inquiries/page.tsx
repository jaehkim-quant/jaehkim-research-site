"use client";

import { useEffect, useState } from "react";

interface Inquiry {
  id: string;
  purpose: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const purposeLabels: Record<string, string> = {
  general: "General",
  collaboration: "Collaboration",
  speaking: "Speaking",
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => setInquiries(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleRead = async (id: string, currentRead: boolean) => {
    const res = await fetch(`/api/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !currentRead }),
    });
    if (res.ok) {
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.id === id ? { ...inq, read: !currentRead } : inq
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
    if (res.ok) {
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    }
  };

  const unreadCount = inquiries.filter((inq) => !inq.read).length;

  if (loading) {
    return (
      <div className="terminal-card px-6 py-16 text-center text-text-dark">
        Loading inquiries...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="terminal-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="terminal-label mb-3">Inbound Queue</div>
            <h1 className="terminal-title text-4xl text-text-title md:text-5xl">
              Inquiries
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <span className="terminal-badge terminal-badge-amber">
                {unreadCount} new
              </span>
            )}
            <span className="terminal-label text-[0.66rem]">
              {inquiries.length} total
            </span>
          </div>
        </div>
      </section>

      {inquiries.length === 0 ? (
        <div className="terminal-card px-6 py-16 text-center text-text-dark">
          No inquiries yet.
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className={`terminal-card ${inq.read ? "" : "border-accent-orange/40"}`}
            >
              <div
                className="flex cursor-pointer items-start gap-4 px-5 py-5"
                onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
              >
                <div
                  className={`mt-2 h-2.5 w-2.5 rounded-full ${
                    inq.read ? "bg-white/20" : "bg-accent-orange"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="terminal-badge terminal-badge-blue">
                      {purposeLabels[inq.purpose] || inq.purpose}
                    </span>
                    <span className="text-sm font-medium text-text-title">
                      {inq.subject}
                    </span>
                  </div>
                  <p className="text-sm text-text-dark">
                    {inq.name} · {inq.email} ·{" "}
                    {new Date(inq.createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className="terminal-number text-sm text-text-dark">
                  {expandedId === inq.id ? "−" : "+"}
                </span>
              </div>

              {expandedId === inq.id && (
                <div className="border-t border-border px-5 pb-5">
                  <div className="mt-4 rounded-sm bg-white/4 p-4">
                    <p className="whitespace-pre-wrap text-sm text-text-dark">
                      {inq.message}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleRead(inq.id, inq.read)}
                      className="terminal-outline-button px-3 py-2 text-sm"
                    >
                      {inq.read ? "Mark as unread" : "Mark as read"}
                    </button>
                    <a
                      href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject)}`}
                      className="terminal-primary-button px-3 py-2 font-label text-xs uppercase tracking-[0.18em]"
                    >
                      Reply via email
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(inq.id)}
                      className="terminal-outline-button ml-auto px-3 py-2 text-sm text-[var(--terminal-danger)]"
                    >
                      Delete
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
