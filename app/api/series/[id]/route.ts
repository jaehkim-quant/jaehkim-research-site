import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function normalizeSlug(value: string | undefined): string {
  if (!value || typeof value !== "string") return "";
  try {
    return decodeURIComponent(value).normalize("NFC").trim();
  } catch {
    return value.normalize("NFC").trim();
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const normalized = normalizeSlug(params.id);
  const nfc = normalized.normalize("NFC");
  const nfd = normalized.normalize("NFD");
  const slugCandidates = nfc !== nfd ? [nfc, nfd] : [nfc];

  const series = await prisma.series.findFirst({
    where: {
      OR: [{ id: normalized }, { slug: { in: slugCandidates } }],
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
    const series = await prisma.series.update({
      where: { id: params.id },
      data: {
        title: body.title,
        slug:
          body.slug != null
            ? String(body.slug).normalize("NFC").trim()
            : undefined,
        description: body.description ?? null,
        type: body.type || undefined,
        level: body.level || "중급",
        published: body.published ?? false,
      },
    });
    return NextResponse.json(series);
  } catch {
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
    await prisma.series.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
