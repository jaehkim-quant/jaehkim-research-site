import { describe, expect, it } from "vitest";
import {
  EmailProviderError,
  resolveEmailProvider,
} from "../lib/email/provider";
import {
  buildUploadObjectKey,
  resolveStorageProvider,
  resolveS3PublicBaseUrl,
  StorageProviderError,
} from "../lib/storage/provider";
import { resolveSiteUrl } from "../lib/site";

describe("provider config resolution", () => {
  it("resolves storage provider to vercel-blob in auto mode when blob token exists", () => {
    expect(
      resolveStorageProvider({
        STORAGE_PROVIDER: "auto",
        BLOB_READ_WRITE_TOKEN: "token",
      })
    ).toBe("vercel-blob");
  });

  it("resolves storage provider to local in auto mode without blob token", () => {
    expect(resolveStorageProvider({ STORAGE_PROVIDER: "auto" })).toBe("local");
  });

  it("resolves storage provider to s3 when explicitly selected", () => {
    expect(resolveStorageProvider({ STORAGE_PROVIDER: "s3" })).toBe("s3");
  });

  it("resolves email provider to resend in auto mode when resend key exists", () => {
    expect(
      resolveEmailProvider({
        EMAIL_PROVIDER: "auto",
        RESEND_API_KEY: "re_test",
      })
    ).toBe("resend");
  });

  it("resolves email provider to noop in auto mode without resend key", () => {
    expect(resolveEmailProvider({ EMAIL_PROVIDER: "auto" })).toBe("noop");
  });

  it("throws on invalid storage provider values", () => {
    expect(() =>
      resolveStorageProvider({ STORAGE_PROVIDER: "something-else" })
    ).toThrow(StorageProviderError);
  });

  it("throws on invalid email provider values", () => {
    expect(() => resolveEmailProvider({ EMAIL_PROVIDER: "smtp" })).toThrow(
      EmailProviderError
    );
  });

  it("builds versioned S3 object keys", () => {
    expect(
      buildUploadObjectKey("image.png", new Date("2026-03-27T12:00:00Z"))
    ).toBe("uploads/2026/03/image.png");
  });

  it("resolves S3 public URL from CloudFront when configured", () => {
    expect(
      resolveS3PublicBaseUrl({
        CLOUDFRONT_URL: "https://cdn.example.com/",
        S3_BUCKET_NAME: "bucket-name",
        AWS_REGION: "ap-northeast-2",
      })
    ).toBe("https://cdn.example.com");
  });

  it("falls back to the S3 bucket URL when no CDN base URL is configured", () => {
    expect(
      resolveS3PublicBaseUrl({
        S3_BUCKET_NAME: "bucket-name",
        AWS_REGION: "ap-northeast-2",
      })
    ).toBe("https://bucket-name.s3.ap-northeast-2.amazonaws.com");
  });

  it("resolves site URL from NEXT_PUBLIC_SITE_URL first", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "https://research.example.com/",
        NEXTAUTH_URL: "https://auth.example.com",
      })
    ).toBe("https://research.example.com");
  });

  it("falls back to NEXTAUTH_URL when NEXT_PUBLIC_SITE_URL is not set", () => {
    expect(
      resolveSiteUrl({
        NEXTAUTH_URL: "https://research.example.com/",
      })
    ).toBe("https://research.example.com");
  });
});
