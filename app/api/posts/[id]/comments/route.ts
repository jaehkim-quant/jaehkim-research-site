import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const comments = await prisma.comment.findMany({
    where: { postId: params.id, parentId: null },
    orderBy: { createdAt: "desc" },
    include: {
      replies: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
  return NextResponse.json(comments);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, content, parentId } = await request.json();

    if (!name?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Name and content are required" },
        { status: 400 }
      );
    }

    if (name.length > 50 || content.length > 2000) {
      return NextResponse.json(
        { error: "Name max 50 chars, content max 2000 chars" },
        { status: 400 }
      );
    }

    if (parentId) {
      const parent = await prisma.comment.findUnique({
        where: { id: parentId },
      });
      if (!parent || parent.parentId !== null) {
        return NextResponse.json(
          { error: "Can only reply to top-level comments" },
          { status: 400 }
        );
      }
    }

    const comment = await prisma.comment.create({
      data: {
        postId: params.id,
        parentId: parentId || null,
        name: name.trim(),
        content: content.trim(),
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
