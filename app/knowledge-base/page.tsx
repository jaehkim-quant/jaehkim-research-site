import { prisma } from "@/lib/prisma";
import { SeriesListPage } from "@/components/series/SeriesListPage";

export default async function KnowledgeBasePage() {
  const seriesList = await prisma.series.findMany({
    where: { published: true, type: "knowledge-base" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { posts: { where: { published: true } } } },
    },
  });

  const data = seriesList.map((s) => ({
    id: s.id,
    title: s.title,
    titleEn: s.titleEn ?? undefined,
    slug: s.slug,
    description: s.description ?? undefined,
    descriptionEn: s.descriptionEn ?? undefined,
    type: s.type,
    level: s.level,
    published: s.published,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    postCount: s._count.posts,
  }));

  return (
    <SeriesListPage
      initialData={data}
      basePath="/knowledge-base"
      translationPrefix="kb"
    />
  );
}
