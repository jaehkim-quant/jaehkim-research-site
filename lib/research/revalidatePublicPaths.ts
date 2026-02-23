import { revalidatePath } from "next/cache";

export const PUBLIC_SERIES_LIST_PATHS = ["/knowledge-base", "/book-notes"] as const;

export function getSeriesDetailPath(type: unknown, slug: unknown): string | null {
  if (typeof slug !== "string" || !slug) return null;
  if (type === "knowledge-base" || type === "book-notes") {
    return `/${type}/${slug}`;
  }
  return null;
}

export function revalidateSeriesPublicPaths(detailPaths: Array<string | null>) {
  const paths = new Set<string>([...PUBLIC_SERIES_LIST_PATHS, "/sitemap.xml"]);
  for (const detailPath of detailPaths) {
    if (detailPath) paths.add(detailPath);
  }
  paths.forEach((path) => {
    revalidatePath(path);
  });
}
