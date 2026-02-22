import { prisma } from "@/lib/prisma";
import { SeriesListPage } from "@/components/series/SeriesListPage";
import { serializeSeriesListItem } from "@/lib/research/serializers";

export default async function KnowledgeBasePage() {
  const seriesList = await prisma.series.findMany({
    where: { published: true, type: "knowledge-base" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { posts: { where: { published: true } } } },
    },
  });

  const data = seriesList.map(serializeSeriesListItem);

  return (
    <SeriesListPage
      initialData={data}
      basePath="/knowledge-base"
      translationPrefix="kb"
    />
  );
}
