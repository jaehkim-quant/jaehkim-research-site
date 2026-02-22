import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSlugVariantsFromPathParam, normalizeSlug } from "@/lib/slug";

const PUBLIC_SERIES_LIST_PATHS = ["/knowledge-base", "/book-notes"] as const;

function getSeriesDetailPath(type: unknown, slug: unknown): string | null {
  if (typeof slug !== "string" || !slug) return null;
  if (type === "knowledge-base" || type === "book-notes") {
    return `/${type}/${slug}`;
  }
  return null;
}

function revalidateSeriesPublicPaths(detailPaths: Array<string | null>) {
  const paths = new Set<string>([...PUBLIC_SERIES_LIST_PATHS, "/sitemap.xml"]);
  for (const detailPath of detailPaths) {
    if (detailPath) paths.add(detailPath);
  }
  paths.forEach((path) => {
    revalidatePath(path);
  });
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const slugCandidates = getSlugVariantsFromPathParam(params.id);
  const primarySlug = slugCandidates[0] ?? params.id;

  const series = await prisma.series.findFirst({
    where: {
      OR: [{ id: primarySlug }, { slug: { in: slugCandidates } }],
    },
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

  if (!series) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const result = {
    ...series,
    posts: series.posts.map((p) => ({
      ...p,
      likeCount: p._count.likes,
      commentCount: p._count.comments,
      _count: undefined,
    })),
  };

  return NextResponse.json(result);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const previousSeries = await prisma.series.findUnique({
      where: { id: params.id },
      select: { slug: true, type: true },
    });

    const series = await prisma.series.update({
      where: { id: params.id },
      data: {
        title: body.title,
        slug:
          body.slug != null
            ? normalizeSlug(String(body.slug))
            : undefined,
        description: body.description ?? null,
        type: body.type || undefined,
        level: body.level || "중급",
        published: body.published ?? false,
      },
    });

    revalidateSeriesPublicPaths([
      getSeriesDetailPath(previousSeries?.type, previousSeries?.slug),
      getSeriesDetailPath(series.type, series.slug),
    ]);

    return NextResponse.json(series);
  } catch (error) {
    console.error("Update series error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingSeries = await prisma.series.findUnique({
      where: { id: params.id },
      select: { slug: true, type: true },
    });

    await prisma.series.delete({ where: { id: params.id } });

    revalidateSeriesPublicPaths([
      getSeriesDetailPath(existingSeries?.type, existingSeries?.slug),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete series error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
