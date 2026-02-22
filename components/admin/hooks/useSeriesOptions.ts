"use client";

import { useEffect, useState } from "react";

export interface SeriesOption {
  id: string;
  title: string;
}

export function useSeriesOptions() {
  const [seriesOptions, setSeriesOptions] = useState<SeriesOption[]>([]);

  useEffect(() => {
    fetch("/api/series?all=true")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: SeriesOption[]) => setSeriesOptions(data))
      .catch(() => {});
  }, []);

  return seriesOptions;
}
