import { describe, expect, it } from "vitest";
import { buildPostWhereClause } from "../lib/research/postQuery";
import {
  serializePostListItem,
  type PostListRecord,
} from "../lib/research/serializers";

describe("post API helpers", () => {
  it("builds admin where clause including unpublished", () => {
    expect(
      buildPostWhereClause({
        isAdmin: true,
        includeUnpublished: true,
        seriesOnly: false,
      })
    ).toEqual({});
  });

  it("builds public where clause for all published posts", () => {
    expect(
      buildPostWhereClause({
        isAdmin: false,
        includeUnpublished: false,
        seriesOnly: false,
      })
    ).toEqual({ published: true });
  });

  it("builds series-only where clause", () => {
    expect(
      buildPostWhereClause({
        isAdmin: false,
        includeUnpublished: false,
        seriesOnly: true,
      })
    ).toEqual({ published: true, seriesId: { not: null } });
  });

  it("serializes post list record with counts and ISO dates", () => {
    const record: PostListRecord = {
      id: "p1",
      title: "T",
      slug: "abc123def456",
      summary: "S",
      tags: ["x"],
      level: "중급",
      published: true,
      date: new Date("2025-01-01T00:00:00.000Z"),
      updatedAt: new Date("2025-01-02T00:00:00.000Z"),
      viewCount: 10,
      seriesId: null,
      seriesOrder: null,
      _count: { likes: 2, comments: 3 },
    };

    const serialized = serializePostListItem(record);
    expect(serialized.likeCount).toBe(2);
    expect(serialized.commentCount).toBe(3);
    expect(serialized.date).toBe("2025-01-01T00:00:00.000Z");
    expect(serialized.updatedAt).toBe("2025-01-02T00:00:00.000Z");
  });
});
