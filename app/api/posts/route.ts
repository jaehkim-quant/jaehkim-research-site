import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeUnpublished = searchParams.get("all") === "true";

  const session = await getServerSession(authOptions);
  const isAdmin = !!session;

  const seriesOnly = searchParams.get("series") === "true";

  const whereClause = isAdmin && includeUnpublished
    ? (seriesOnly ? { seriesId: { not: null } } : {})
    : seriesOnly
      ? { published: true, seriesId: { not: null } }
      : { published: true, seriesId: null };

  const posts = await prisma.post.findMany({
    where: whereClause,
    orderBy: { date: "desc" },
    include: {
      _count: { select: { likes: true, comments: true } },
    },
  });

  const result = posts.map((post) => ({
    ...post,
    likeCount: post._count.likes,
    commentCount: post._count.comments,
    _count: undefined,
  }));

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const slug =
      body.slug ||
      body.titleEn
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") ||
      `post-${Date.now()}`;

    const post = await prisma.post.create({
      data: {
        title: body.title,
        titleEn: body.titleEn || null,
        slug,
        summary: body.summary,
        summaryEn: body.summaryEn || null,
        content: body.content || null,
        contentEn: body.contentEn || null,
        tags: body.tags || [],
        tagsEn: body.tagsEn || [],
        level: body.level || "중급",
        published: body.published ?? false,
        date: body.date ? new Date(body.date) : new Date(),
        seriesId: body.seriesId || null,
        seriesOrder: body.seriesOrder != null ? Number(body.seriesOrder) : null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
