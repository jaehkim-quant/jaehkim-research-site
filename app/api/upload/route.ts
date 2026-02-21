import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";
import { customAlphabet } from "nanoid";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 4 * 1024 * 1024; // 4MB
const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 12);

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Allowed types: JPEG, PNG, GIF, WebP" },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large (max 4MB)" },
      { status: 400 }
    );
  }

  const ext = path.extname(file.name) || ".jpg";
  const filename = `${nanoid()}${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(filename, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return NextResponse.json({ url: blob.url });
    } catch (err) {
      console.error("Vercel Blob upload error:", err);
      return NextResponse.json(
        { error: "Upload failed" },
        { status: 500 }
      );
    }
  }

  // Local fallback: save to public/uploads
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const filepath = path.join(uploadDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const url = baseUrl ? `${baseUrl}/uploads/${filename}` : `/uploads/${filename}`;
  return NextResponse.json({ url });
}
