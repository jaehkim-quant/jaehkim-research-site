import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

function getClientIp(): string {
  const h = headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const ip = getClientIp();
  const [count, existing] = await Promise.all([
    prisma.postLike.count({ where: { postId: params.id } }),
    prisma.postLike.findUnique({
      where: { postId_ip: { postId: params.id, ip } },
    }),
  ]);
  return NextResponse.json({ likeCount: count, liked: !!existing });
}

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const ip = getClientIp();

  try {
    const existing = await prisma.postLike.findUnique({
      where: { postId_ip: { postId: params.id, ip } },
    });

    if (existing) {
      await prisma.postLike.delete({ where: { id: existing.id } });
    } else {
      await prisma.postLike.create({
        data: { postId: params.id, ip },
      });
    }

    const likeCount = await prisma.postLike.count({
      where: { postId: params.id },
    });

    return NextResponse.json({ likeCount, liked: !existing });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
