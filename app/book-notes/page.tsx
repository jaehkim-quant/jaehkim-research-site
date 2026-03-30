import { prisma } from "@/lib/prisma";
import { SeriesListPage } from "@/components/series/SeriesListPage";
import { serializeSeriesListItem } from "@/lib/research/serializers";

export const dynamic = "force-dynamic";

export default async function BookNotesPage() {
  const seriesList = await prisma.series.findMany({
    where: { published: true, type: "book-notes" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { posts: { where: { published: true } } } },
    },
  });

  const data = seriesList.map(serializeSeriesListItem);

  return (
    <SeriesListPage
      initialData={data}
      basePath="/book-notes"
      translationPrefix="bn"
    />
  );
}
