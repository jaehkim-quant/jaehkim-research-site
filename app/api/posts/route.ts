import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeUnpublished = searchParams.get("all") === "true";

  const session = await getServerSession(authOptions);
  const isAdmin = !!session;

  const posts = await prisma.post.findMany({
    where: isAdmin && includeUnpublished ? {} : { published: true },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(posts);
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
