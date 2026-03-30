"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { SeriesForm } from "@/components/admin/SeriesForm";

export default function EditSeriesPage() {
  const params = useParams();
  const id = params.id as string;

  const [series, setSeries] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/series/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Series not found");
        return res.json();
      })
      .then((data) => setSeries(data))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load series")
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="terminal-card px-6 py-16 text-center text-text-dark">
        Loading...
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="terminal-card px-6 py-16 text-center text-[var(--terminal-danger)]">
        {error || "Series not found"}
      </div>
    );
  }

  const initialData = {
    id: series.id as string,
    title: (series.title as string) || "",
    slug: (series.slug as string) || "",
    description: (series.description as string) || "",
    type: (series.type as string) || "knowledge-base",
    level: (series.level as string) || "중급",
    published: (series.published as boolean) || false,
  };

  return (
    <div className="space-y-4">
      <section className="terminal-card p-6 md:p-8">
        <div className="terminal-label mb-3">Edit Collection</div>
        <h1 className="terminal-title text-4xl text-text-title md:text-5xl">
          Edit Series
        </h1>
      </section>
      <SeriesForm mode="edit" initialData={initialData} />
    </div>
  );
}
