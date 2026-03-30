"use client";

import { SeriesForm } from "@/components/admin/SeriesForm";

export default function NewSeriesPage() {
  return (
    <div className="space-y-4">
      <section className="terminal-card p-6 md:p-8">
        <div className="terminal-label mb-3">Create Collection</div>
        <h1 className="terminal-title text-4xl text-text-title md:text-5xl">
          New Series
        </h1>
      </section>
      <SeriesForm mode="create" />
    </div>
  );
}
