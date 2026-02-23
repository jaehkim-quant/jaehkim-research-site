import { describe, expect, it } from "vitest";
import {
  EmailProviderError,
  resolveEmailProvider,
} from "../lib/email/provider";
import {
  resolveStorageProvider,
  StorageProviderError,
} from "../lib/storage/provider";

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
});

