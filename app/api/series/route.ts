import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createRandomUrlSlug, normalizeSlug } from "@/lib/slug";
import { serializeSeriesListItem } from "@/lib/research/serializers";

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUnpublished = searchParams.get("all") === "true";

    const session = await getServerSession(authOptions);
    const isAdmin = !!session;

    const typeFilter = searchParams.get("type");

    const where: Record<string, unknown> = {};
    if (!(isAdmin && includeUnpublished)) {
      where.published = true;
    }
    if (typeFilter) {
      where.type = typeFilter;
    }

    const seriesList = await prisma.series.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            posts: isAdmin && includeUnpublished ? true : { where: { published: true } },
          },
        },
      },
    });

    const result = seriesList.map(serializeSeriesListItem);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch series error:", error);
    return NextResponse.json(
      { error: "Failed to fetch series" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    let slug: string;
    if (body.slug && String(body.slug).trim()) {
      slug = normalizeSlug(String(body.slug));
    } else {
      let candidate = createRandomUrlSlug();
      for (let i = 0; i < 5; i++) {
        const exists = await prisma.series.findUnique({
          where: { slug: candidate },
          select: { id: true },
        });
        if (!exists) break;
        candidate = createRandomUrlSlug();
      }
      slug = candidate;
    }

    const series = await prisma.series.create({
      data: {
        title: body.title,
        slug,
        description: body.description || null,
        type: body.type || "knowledge-base",
        level: body.level || "중급",
        published: body.published ?? false,
      },
    });

    revalidateSeriesPublicPaths([getSeriesDetailPath(series.type, series.slug)]);

    return NextResponse.json(series, { status: 201 });
  } catch (error) {
    console.error("Create series error:", error);
    return NextResponse.json({ error: "Failed to create series" }, { status: 500 });
  }
}
