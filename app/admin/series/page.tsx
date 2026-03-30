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
  "knowledge-base": "Knowledge",
  "book-notes": "Book",
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
    <div className="space-y-4">
      <section className="terminal-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="terminal-label mb-3">Series Operations</div>
            <h1 className="terminal-title text-4xl text-text-title md:text-5xl">
              Series
            </h1>
            <p className="terminal-copy mt-4 max-w-3xl text-sm md:text-base">
              Manage knowledge-base and book-note collections without changing route structure or publishing flow.
            </p>
          </div>
          <Link
            href="/admin/series/new"
            className="terminal-primary-button font-label text-xs uppercase tracking-[0.2em]"
          >
            New Series
          </Link>
        </div>
      </section>

      {loading ? (
        <div className="terminal-card px-6 py-16 text-center text-text-dark">
          Loading...
        </div>
      ) : errorMessage ? (
        <div className="terminal-card px-6 py-16 text-center">
          <p className="mb-2 text-[var(--terminal-danger)]">Failed to load series</p>
          <p className="mb-4 text-sm text-text-dark">{errorMessage}</p>
          <button
            type="button"
            onClick={fetchSeries}
            className="terminal-outline-button px-4 py-3 text-sm"
          >
            Retry
          </button>
        </div>
      ) : seriesList.length === 0 ? (
        <div className="terminal-card px-6 py-16 text-center text-text-dark">
          No series yet.
        </div>
      ) : (
        <div className="terminal-card overflow-hidden p-4 md:p-5">
          <table className="terminal-table">
            <thead>
              <tr>
                <th>Title</th>
                <th className="hidden md:table-cell">Type</th>
                <th className="hidden md:table-cell">Level</th>
                <th className="hidden lg:table-cell">Posts</th>
                <th className="hidden md:table-cell">Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {seriesList.map((series) => (
                <tr key={series.id}>
                  <td>
                    <div className="space-y-1">
                      <div className="font-medium text-text-title">{series.title}</div>
                      <div className="text-xs text-text-dark">{series.slug}</div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">
                    <span className="terminal-badge terminal-badge-blue">
                      {typeLabels[series.type] || series.type}
                    </span>
                  </td>
                  <td className="hidden md:table-cell text-sm text-text-dark">
                    {series.level}
                  </td>
                  <td className="hidden lg:table-cell text-sm text-text-dark">
                    {series.postCount}
                  </td>
                  <td className="hidden md:table-cell">
                    <span
                      className={`terminal-badge ${
                        series.published
                          ? "terminal-badge-amber"
                          : "terminal-badge-neutral"
                      }`}
                    >
                      {series.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/series/${series.id}/edit`}
                        className="terminal-outline-button px-3 py-2 text-xs"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(series.id)}
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
      )}
    </div>
  );
}
