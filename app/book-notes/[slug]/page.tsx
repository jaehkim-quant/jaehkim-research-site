import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SeriesDetailPage } from "@/components/series/SeriesDetailPage";
import type { Level } from "@/lib/research/types";

export default async function BookNotesSeriesPage({
  params,
}: {
  params: { slug: string };
}) {
  const series = await prisma.series.findFirst({
    where: { OR: [{ id: params.slug }, { slug: params.slug }] },
    include: {
      posts: {
        where: { published: true },
        orderBy: { seriesOrder: "asc" },
        include: {
          _count: { select: { likes: true, comments: true } },
        },
      },
    },
  });

  if (!series) notFound();

  const data = {
    id: series.id,
    title: series.title,
    slug: series.slug,
    description: series.description ?? undefined,
    type: series.type,
    level: series.level,
    published: series.published,
    createdAt: series.createdAt.toISOString(),
    updatedAt: series.updatedAt.toISOString(),
    posts: series.posts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      content: p.content ?? undefined,
      tags: p.tags,
      level: p.level as Level,
      date: p.date.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      published: p.published,
      viewCount: p.viewCount,
      seriesId: p.seriesId ?? undefined,
      seriesOrder: p.seriesOrder ?? undefined,
      likeCount: p._count.likes,
      commentCount: p._count.comments,
    })),
  };

  return (
    <SeriesDetailPage
      initialData={data}
      basePath="/book-notes"
      translationPrefix="bn"
    />
  );
}
