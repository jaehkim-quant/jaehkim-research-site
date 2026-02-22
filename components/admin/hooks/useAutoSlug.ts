"use client";

import { useCallback, useState } from "react";
import { createRandomUrlSlug } from "@/lib/slug";

interface SlugResponseItem {
  slug?: string;
}

/**
 * Generates collision-resistant random slugs and checks collisions against
 * an API list endpoint. Falls back to local random generation on network errors.
 */
export function useAutoSlug(listEndpoint: string) {
  const [slugGenerating, setSlugGenerating] = useState(false);

  const generateSlug = useCallback(async (): Promise<string> => {
    setSlugGenerating(true);

    try {
      const res = await fetch(listEndpoint);
      if (!res.ok) throw new Error("Failed to load existing slugs");

      const data = (await res.json()) as SlugResponseItem[];
      const existingSlugs = new Set(
        data
          .map((item) => (typeof item.slug === "string" ? item.slug : ""))
          .filter(Boolean)
      );

      let candidate = createRandomUrlSlug();
      for (let i = 0; i < 8; i += 1) {
        if (!existingSlugs.has(candidate)) break;
        candidate = createRandomUrlSlug();
      }

      return candidate;
    } catch {
      return createRandomUrlSlug();
    } finally {
      setSlugGenerating(false);
    }
  }, [listEndpoint]);

  return { slugGenerating, generateSlug };
}
