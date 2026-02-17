import { prisma } from "@/lib/prisma";
import { ResearchLibraryClient } from "./ResearchLibraryClient";
import type { Level } from "@/lib/research/types";

export default async function ResearchLibraryPage() {
  const posts = await prisma.post.findMany({
    where: { published: true, seriesId: null },
    orderBy: { date: "desc" },
    include: {
      _count: { select: { likes: true, comments: true } },
    },
  });

  const initialPosts = posts.map((p) => ({
    id: p.id,
    title: p.title,
    titleEn: p.titleEn ?? undefined,
    slug: p.slug,
    summary: p.summary,
    summaryEn: p.summaryEn ?? undefined,
    tags: p.tags,
    tagsEn: p.tagsEn,
    level: p.level as Level,
    date: p.date.toISOString(),
    viewCount: p.viewCount,
    likeCount: p._count.likes,
    commentCount: p._count.comments,
  }));

  return <ResearchLibraryClient initialPosts={initialPosts} />;
}
