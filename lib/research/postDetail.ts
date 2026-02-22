export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface RelatedPostCandidate {
  id: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  date: Date | string;
}

export interface RelatedPostPreview {
  id: string;
  slug: string;
  title: string;
  summary: string;
}

export function toPlainText(markdown: string | undefined): string {
  if (!markdown) return "";
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/[#>*_~`|[\]()-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function estimateReadTime(markdown: string | undefined): number {
  const text = toPlainText(markdown);
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function extractToc(markdown: string | undefined): TocItem[] {
  if (!markdown) return [];
  const items: TocItem[] = [];

  const headingMatches = Array.from(markdown.matchAll(/^(#{2,3})\s+(.+)$/gm));
  for (const match of headingMatches) {
    const level = match[1].length;
    const rawText = match[2].replace(/\s+#+\s*$/, "");
    const text = rawText
      .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
      .replace(/[`*_~]/g, "")
      .trim();
    if (!text) continue;
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, "-")
      .replace(/(^-|-$)/g, "");
    items.push({ id, text, level });
  }

  if (items.length > 0) return items;

  const fallback = /<(h[2-3])[^>]*id="([^"]*)"[^>]*>(.*?)<\/\1>/gi;
  let match;
  while ((match = fallback.exec(markdown)) !== null) {
    items.push({
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, ""),
      level: parseInt(match[1][1], 10),
    });
  }
  return items;
}

export function getCommentTotal(
  commentCountFromApi: number | undefined,
  comments: Array<{ replies?: unknown[] }>
) {
  if (comments.length === 0) return commentCountFromApi ?? 0;
  return comments.reduce(
    (total, comment) => total + 1 + (comment.replies?.length || 0),
    0
  );
}

export function pickRelatedPosts(
  currentTags: string[],
  candidates: RelatedPostCandidate[],
  limit = 3
): RelatedPostPreview[] {
  if (currentTags.length === 0 || candidates.length === 0) return [];

  return candidates
    .map((candidate) => ({
      ...candidate,
      overlap: candidate.tags.filter((tag) => currentTags.includes(tag)).length,
    }))
    .sort(
      (a, b) =>
        b.overlap - a.overlap ||
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, limit)
    .map(({ id, slug, title, summary }) => ({ id, slug, title, summary }));
}
