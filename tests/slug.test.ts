import { describe, expect, it } from "vitest";
import {
  URL_SAFE_SLUG_ALPHABET,
  URL_SAFE_SLUG_LENGTH,
  createRandomUrlSlug,
  getSlugVariants,
  getSlugVariantsFromPathParam,
  normalizeSlug,
  normalizeSlugFromPathParam,
} from "../lib/slug";

describe("slug utilities", () => {
  it("creates URL-safe random slug with default length", () => {
    const slug = createRandomUrlSlug();
    expect(slug).toHaveLength(URL_SAFE_SLUG_LENGTH);
    expect(
      slug.split("").every((char) => URL_SAFE_SLUG_ALPHABET.includes(char))
    ).toBe(true);
  });

  it("normalizes slug with NFC and trims spaces", () => {
    const decomposed = "\u1100\u1161";
    expect(normalizeSlug(` ${decomposed} `)).toBe("가");
  });

  it("decodes encoded path slugs before normalization", () => {
    expect(normalizeSlugFromPathParam("%EA%B0%80")).toBe("가");
  });

  it("falls back safely on malformed URI path slugs", () => {
    expect(normalizeSlugFromPathParam("%E0%A4%A")).toBe("%E0%A4%A");
  });

  it("returns NFC/NFD variants for unicode slug lookups", () => {
    const variants = getSlugVariants("가");
    expect(variants).toContain("가");
    expect(variants.length).toBeGreaterThanOrEqual(1);
  });

  it("returns path-based slug variants for encoded unicode", () => {
    const variants = getSlugVariantsFromPathParam("%EA%B0%80");
    expect(variants).toContain("가");
  });
});
