import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

type EnvMap = Record<string, string | undefined>;

export type StorageProviderName = "vercel-blob" | "local" | "s3";
export type StorageProviderSetting = StorageProviderName | "auto";

export type UploadPublicFileInput = {
  file: File;
  filename: string;
};

export type UploadPublicFileResult = {
  url: string;
  provider: StorageProviderName;
};

export class StorageProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageProviderError";
  }
}

export function resolveStorageProvider(
  env: EnvMap = process.env
): StorageProviderName {
  const configured = normalizeStorageProvider(env.STORAGE_PROVIDER);

  if (configured && configured !== "auto") {
    return configured;
  }

  if (env.BLOB_READ_WRITE_TOKEN) {
    return "vercel-blob";
  }

  return "local";
}

export async function uploadPublicFile(
  input: UploadPublicFileInput,
  env: EnvMap = process.env
): Promise<UploadPublicFileResult> {
  const provider = resolveStorageProvider(env);

  switch (provider) {
    case "vercel-blob":
      return uploadToVercelBlob(input, env);
    case "local":
      return uploadToLocal(input, env);
    case "s3":
      return uploadToS3(input, env);
    default: {
      const exhaustiveCheck: never = provider;
      throw new StorageProviderError(
        `Unsupported storage provider: ${exhaustiveCheck}`
      );
    }
  }
}

function normalizeStorageProvider(
  value?: string
): StorageProviderSetting | null {
  if (!value) return null;

  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;

  if (
    normalized === "auto" ||
    normalized === "vercel-blob" ||
    normalized === "local" ||
    normalized === "s3"
  ) {
    return normalized;
  }

  throw new StorageProviderError(
    `Invalid STORAGE_PROVIDER value "${value}". Expected one of: auto, vercel-blob, local, s3.`
  );
}

async function uploadToVercelBlob(
  { file, filename }: UploadPublicFileInput,
  env: EnvMap
): Promise<UploadPublicFileResult> {
  const token = env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new StorageProviderError(
      "BLOB_READ_WRITE_TOKEN is required when using vercel-blob storage."
    );
  }

  const blob = await put(filename, file, {
    access: "public",
    token,
  });

  return {
    url: blob.url,
    provider: "vercel-blob",
  };
}

async function uploadToLocal(
  { file, filename }: UploadPublicFileInput,
  env: EnvMap
): Promise<UploadPublicFileResult> {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const filepath = path.join(uploadDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  const baseUrl = env.NEXT_PUBLIC_SITE_URL || "";
  const url = baseUrl ? `${baseUrl}/uploads/${filename}` : `/uploads/${filename}`;

  return {
    url,
    provider: "local",
  };
}

async function uploadToS3(
  _input: UploadPublicFileInput,
  env: EnvMap
): Promise<UploadPublicFileResult> {
  const missing = ["AWS_REGION", "S3_BUCKET_NAME"].filter(
    (key) => !env[key]
  );

  throw new StorageProviderError(
    missing.length > 0
      ? `STORAGE_PROVIDER=s3 is selected, but required env vars are missing: ${missing.join(", ")}.`
      : "STORAGE_PROVIDER=s3 is selected, but S3 upload implementation is not yet installed. Add an AWS S3 provider (AWS SDK) before enabling it in production."
  );
}
