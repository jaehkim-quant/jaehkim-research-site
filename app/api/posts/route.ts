import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createRandomUrlSlug, normalizeSlug } from "@/lib/slug";
import { buildPostWhereClause } from "@/lib/research/postQuery";
import {
  postListSelect,
  serializePostListItem,
} from "@/lib/research/serializers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeUnpublished = searchParams.get("all") === "true";

  const session = await getServerSession(authOptions);
  const isAdmin = !!session;

  const seriesOnly = searchParams.get("series") === "true";

  const whereClause = buildPostWhereClause({
    isAdmin,
    includeUnpublished,
    seriesOnly,
  });

  const posts = await prisma.post.findMany({
    where: whereClause,
    orderBy: { date: "desc" },
    select: postListSelect,
  });

  const result = posts.map(serializePostListItem);

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
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
      // Collision-resistant unique slug (no title-based overlap)
      let candidate = createRandomUrlSlug();
      for (let i = 0; i < 5; i++) {
        const exists = await prisma.post.findUnique({
          where: { slug: candidate },
          select: { id: true },
        });
        if (!exists) break;
        candidate = createRandomUrlSlug();
      }
      slug = candidate;
    }

    const post = await prisma.post.create({
      data: {
        title: body.title,
        slug,
        summary: body.summary,
        content: body.content || null,
        tags: body.tags || [],
        level: body.level || "중급",
        published: body.published ?? false,
        date: body.date ? new Date(body.date) : new Date(),
        seriesId: body.seriesId || null,
        seriesOrder: body.seriesOrder != null ? Number(body.seriesOrder) : null,
      },
    });

    revalidatePath("/");
    revalidatePath("/research");
    revalidatePath("/sitemap.xml");
    if (post.published) revalidatePath(`/research/${post.slug}`);

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
