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
    return <div className="py-12 text-center text-slate-500">Loading...</div>;
  }

  if (error || !series) {
    return (
      <div className="py-12 text-center text-red-600">
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
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Series</h1>
      <SeriesForm mode="edit" initialData={initialData} />
    </div>
  );
}
