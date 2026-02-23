import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeSlug } from "@/lib/slug";
import {
  getSeriesDetailPath,
  revalidateSeriesPublicPaths,
} from "@/lib/research/revalidatePublicPaths";

async function revalidateSeriesPathsByIds(seriesIds: Array<string | null | undefined>) {
  const uniqueIds = Array.from(
    new Set(seriesIds.filter((id): id is string => Boolean(id)))
  );

  if (uniqueIds.length === 0) return;

  const seriesList = await prisma.series.findMany({
    where: { id: { in: uniqueIds } },
    select: { type: true, slug: true },
  });

  revalidateSeriesPublicPaths(
    seriesList.map((series) => getSeriesDetailPath(series.type, series.slug))
  );
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
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
    const previousPost = await prisma.post.findUnique({
      where: { id: params.id },
      select: { seriesId: true },
    });

    const slugUpdate =
      body.slug != null
        ? { slug: normalizeSlug(String(body.slug)) }
        : {};

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        title: body.title,
        ...slugUpdate,
        summary: body.summary,
        content: body.content ?? undefined,
        tags: body.tags ?? undefined,
        level: body.level ?? undefined,
        published: body.published ?? undefined,
        date: body.date ? new Date(body.date) : undefined,
        seriesId:
          body.seriesId !== undefined ? (body.seriesId || null) : undefined,
        seriesOrder:
          body.seriesOrder !== undefined
            ? body.seriesOrder != null
              ? Number(body.seriesOrder)
              : null
            : undefined,
      },
    });

    revalidatePath("/");
    revalidatePath("/research");
    revalidatePath("/sitemap.xml");
    revalidatePath(`/research/${post.slug}`);
    await revalidateSeriesPathsByIds([previousPost?.seriesId, post.seriesId]);

    return NextResponse.json(post);
  } catch (error) {
    console.error("Update post error:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      select: { slug: true, seriesId: true },
    });
    await prisma.post.delete({
      where: { id: params.id },
    });
    revalidatePath("/");
    revalidatePath("/research");
    revalidatePath("/sitemap.xml");
    if (post?.slug) revalidatePath(`/research/${post.slug}`);
    await revalidateSeriesPathsByIds([post?.seriesId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete post error:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
