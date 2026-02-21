import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { customAlphabet } from "nanoid";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const urlSafeId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 12);

export async function GET(request: Request) {
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
        select: { posts: isAdmin && includeUnpublished ? true : { where: { published: true } } },
      },
    },
  });

  const result = seriesList.map((s) => ({
    ...s,
    postCount: s._count.posts,
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

    let slug: string;
    if (body.slug && String(body.slug).trim()) {
      slug = String(body.slug).normalize("NFC").trim();
    } else {
      let candidate = urlSafeId();
      for (let i = 0; i < 5; i++) {
        const exists = await prisma.series.findUnique({
          where: { slug: candidate },
          select: { id: true },
        });
        if (!exists) break;
        candidate = urlSafeId();
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

    return NextResponse.json(series, { status: 201 });
  } catch (error) {
    console.error("Create series error:", error);
    return NextResponse.json({ error: "Failed to create series" }, { status: 500 });
  }
}
