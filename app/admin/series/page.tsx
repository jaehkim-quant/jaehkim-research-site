"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SeriesItem {
  id: string;
  title: string;
  slug: string;
  type: string;
  level: string;
  published: boolean;
  postCount: number;
  createdAt: string;
}

const typeLabels: Record<string, string> = {
  "knowledge-base": "Knowledge Base",
  "book-notes": "Book Notes",
};

export default function AdminSeriesPage() {
  const [seriesList, setSeriesList] = useState<SeriesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchSeries = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/series?all=true");

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

      setSeriesList(data);
    } catch (error) {
      setSeriesList([]);
      setErrorMessage(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
      console.error("Failed to fetch series:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this series? Posts will be unlinked but not deleted.")) return;
    await fetch(`/api/series/${id}`, { method: "DELETE" });
    fetchSeries();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Series</h1>
        <Link
          href="/admin/series/new"
          className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
        >
          + New Series
        </Link>
      </div>

      {loading ? (
        <p className="text-slate-500 py-8">Loading...</p>
      ) : errorMessage ? (
        <div className="py-8">
          <p className="text-red-600 mb-2">Failed to load series</p>
          <p className="text-sm text-slate-500 mb-4">{errorMessage}</p>
          <button
            onClick={fetchSeries}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : seriesList.length === 0 ? (
        <p className="text-slate-500 py-8">No series yet.</p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left">
                <th className="px-4 py-3 text-sm font-medium text-slate-600">Title</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-600">Type</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-600">Level</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-600">Posts</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {seriesList.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-slate-900">{s.title}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                      {typeLabels[s.type] || s.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{s.level}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{s.postCount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        s.published
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {s.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/series/${s.id}/edit`}
                        className="text-sm text-orange-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-sm text-red-600 hover:underline"
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
      )}
    </div>
  );
}
