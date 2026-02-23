import { describe, expect, it } from "vitest";
import {
  estimateReadTime,
  extractToc,
  getCommentTotal,
  pickRelatedPosts,
  toPlainText,
} from "../lib/research/postDetail";

describe("post detail utilities", () => {
  it("converts markdown into clean plain text", () => {
    const markdown = "# Title\n\n[Link](https://example.com) `code` **bold**";
    expect(toPlainText(markdown)).toContain("Link");
    expect(toPlainText(markdown)).not.toContain("https://example.com");
  });

  it("estimates read time with minimum 1 minute", () => {
    expect(estimateReadTime("")).toBe(1);
    expect(estimateReadTime("word ".repeat(400))).toBeGreaterThanOrEqual(2);
  });

  it("extracts H2/H3 markdown headings as TOC", () => {
    const markdown = "## Section A\nText\n### Section B\nText";
    const toc = extractToc(markdown);
    expect(toc).toHaveLength(2);
    expect(toc[0]).toMatchObject({ text: "Section A", level: 2 });
    expect(toc[1]).toMatchObject({ text: "Section B", level: 3 });
  });

  it("unescapes markdown punctuation in TOC headings", () => {
    const markdown = "## (1) TGA \\|= 재무부 금고 · \\[소유권] 예시\n";
    const toc = extractToc(markdown);
    expect(toc).toHaveLength(1);
    expect(toc[0]?.text).toBe("(1) TGA |= 재무부 금고 · [소유권] 예시");
  });

  it("falls back to HTML heading parsing for TOC", () => {
    const html = '<h2 id="sec-1">Section 1</h2><h3 id="sec-2">Section 2</h3>';
    const toc = extractToc(html);
    expect(toc).toHaveLength(2);
    expect(toc[0]).toMatchObject({ id: "sec-1", text: "Section 1" });
  });

  it("calculates total comments including replies", () => {
    const total = getCommentTotal(undefined, [{ replies: [{}, {}] }, { replies: [] }]);
    expect(total).toBe(4);
  });

  it("uses API count fallback when comments are not loaded", () => {
    expect(getCommentTotal(7, [])).toBe(7);
  });

  it("ranks related posts by tag overlap then recency", () => {
    const related = pickRelatedPosts(
      ["퀀트", "매크로"],
      [
        {
          id: "1",
          slug: "a1",
          title: "A",
          summary: "A",
          tags: ["퀀트"],
          date: "2025-01-01T00:00:00.000Z",
        },
        {
          id: "2",
          slug: "a2",
          title: "B",
          summary: "B",
          tags: ["퀀트", "매크로"],
          date: "2024-01-01T00:00:00.000Z",
        },
        {
          id: "3",
          slug: "a3",
          title: "C",
          summary: "C",
          tags: ["매크로"],
          date: "2026-01-01T00:00:00.000Z",
        },
      ],
      2
    );

    expect(related).toHaveLength(2);
    expect(related[0].slug).toBe("a2");
    expect(related[1].slug).toBe("a3");
  });
});
