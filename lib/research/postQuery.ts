import type { Prisma } from "@prisma/client";

interface BuildPostWhereClauseParams {
  isAdmin: boolean;
  includeUnpublished: boolean;
  seriesOnly: boolean;
}

export function buildPostWhereClause({
  isAdmin,
  includeUnpublished,
  seriesOnly,
}: BuildPostWhereClauseParams): Prisma.PostWhereInput {
  if (isAdmin && includeUnpublished) {
    return seriesOnly ? { seriesId: { not: null } } : {};
  }

  if (seriesOnly) {
    return { published: true, seriesId: { not: null } };
  }

  return { published: true, seriesId: null };
}
