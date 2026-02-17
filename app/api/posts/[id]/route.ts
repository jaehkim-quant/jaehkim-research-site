import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        title: body.title,
        titleEn: body.titleEn ?? undefined,
        slug: body.slug ?? undefined,
        summary: body.summary,
        summaryEn: body.summaryEn ?? undefined,
        content: body.content ?? undefined,
        contentEn: body.contentEn ?? undefined,
        tags: body.tags ?? undefined,
        tagsEn: body.tagsEn ?? undefined,
        level: body.level ?? undefined,
        published: body.published ?? undefined,
        date: body.date ? new Date(body.date) : undefined,
        seriesId: body.seriesId !== undefined ? (body.seriesId || null) : undefined,
        seriesOrder: body.seriesOrder !== undefined ? (body.seriesOrder != null ? Number(body.seriesOrder) : null) : undefined,
      },
    });

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
    await prisma.post.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete post error:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
