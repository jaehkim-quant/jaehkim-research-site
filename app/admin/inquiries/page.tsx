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
    return <p className="text-slate-500 py-8">Loading inquiries...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Inquiries
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-sm font-medium bg-orange-100 text-orange-700 rounded-full">
              {unreadCount} new
            </span>
          )}
        </h1>
        <p className="text-sm text-slate-500">{inquiries.length} total</p>
      </div>

      {inquiries.length === 0 ? (
        <p className="text-slate-500 py-16 text-center">
          No inquiries yet.
        </p>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className={`border rounded-lg bg-white transition-colors ${
                inq.read
                  ? "border-slate-200"
                  : "border-orange-300 bg-orange-50/30"
              }`}
            >
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                onClick={() =>
                  setExpandedId(expandedId === inq.id ? null : inq.id)
                }
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    inq.read ? "bg-slate-300" : "bg-orange-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {purposeLabels[inq.purpose] || inq.purpose}
                    </span>
                    <span className="font-medium text-slate-900 truncate">
                      {inq.subject}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
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
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${
                    expandedId === inq.id ? "rotate-180" : ""
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

              {expandedId === inq.id && (
                <div className="px-5 pb-5 border-t border-slate-100">
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                      {inq.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => toggleRead(inq.id, inq.read)}
                      className="text-sm px-3 py-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-50"
                    >
                      {inq.read ? "Mark as unread" : "Mark as read"}
                    </button>
                    <a
                      href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject)}`}
                      className="text-sm px-3 py-1.5 rounded bg-orange-500 text-white hover:bg-orange-600"
                    >
                      Reply via email
                    </a>
                    <button
                      onClick={() => handleDelete(inq.id)}
                      className="text-sm px-3 py-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50 ml-auto"
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
