"use client";

import { SeriesForm } from "@/components/admin/SeriesForm";

export default function NewSeriesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">New Series</h1>
      <SeriesForm mode="create" />
    </div>
  );
}
