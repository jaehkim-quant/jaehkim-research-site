import { PrismaClient } from "@prisma/client";

type DbSnapshot = {
  counts: {
    postCount: number;
    publishedPostCount: number;
    draftPostCount: number;
    seriesCount: number;
    commentCount: number;
    topLevelCommentCount: number;
    replyCommentCount: number;
    postLikeCount: number;
    otpCodeCount: number;
    contactInquiryCount: number;
    postsWithSeriesCount: number;
  };
  postSlugs: string[];
  seriesSlugs: string[];
  seriesPostCounts: Array<{ slug: string; postCount: number }>;
};

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function diffStrings(source: string[], target: string[]) {
  const sourceSet = new Set(source);
  const targetSet = new Set(target);

  return {
    missingInTarget: source.filter((value) => !targetSet.has(value)),
    extraInTarget: target.filter((value) => !sourceSet.has(value)),
  };
}

function diffSeriesCounts(
  source: Array<{ slug: string; postCount: number }>,
  target: Array<{ slug: string; postCount: number }>
) {
  const targetMap = new Map(target.map((item) => [item.slug, item.postCount]));

  return source
    .filter((item) => targetMap.get(item.slug) !== item.postCount)
    .map((item) => ({
      slug: item.slug,
      source: item.postCount,
      target: targetMap.get(item.slug) ?? null,
    }));
}

async function loadSnapshot(prisma: PrismaClient): Promise<DbSnapshot> {
  const [
    postCount,
    publishedPostCount,
    draftPostCount,
    seriesCount,
    commentCount,
    topLevelCommentCount,
    replyCommentCount,
    postLikeCount,
    otpCodeCount,
    contactInquiryCount,
    postsWithSeriesCount,
    postSlugs,
    seriesSlugs,
    seriesPostCounts,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.count({ where: { published: false } }),
    prisma.series.count(),
    prisma.comment.count(),
    prisma.comment.count({ where: { parentId: null } }),
    prisma.comment.count({ where: { parentId: { not: null } } }),
    prisma.postLike.count(),
    prisma.otpCode.count(),
    prisma.contactInquiry.count(),
    prisma.post.count({ where: { seriesId: { not: null } } }),
    prisma.post.findMany({
      select: { slug: true },
      orderBy: { slug: "asc" },
    }),
    prisma.series.findMany({
      select: { slug: true },
      orderBy: { slug: "asc" },
    }),
    prisma.series.findMany({
      select: {
        slug: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: { slug: "asc" },
    }),
  ]);

  return {
    counts: {
      postCount,
      publishedPostCount,
      draftPostCount,
      seriesCount,
      commentCount,
      topLevelCommentCount,
      replyCommentCount,
      postLikeCount,
      otpCodeCount,
      contactInquiryCount,
      postsWithSeriesCount,
    },
    postSlugs: postSlugs.map((item) => item.slug),
    seriesSlugs: seriesSlugs.map((item) => item.slug),
    seriesPostCounts: seriesPostCounts.map((item) => ({
      slug: item.slug,
      postCount: item._count.posts,
    })),
  };
}

async function main() {
  const sourceDatabaseUrl = requiredEnv("SOURCE_DATABASE_URL");
  const targetDatabaseUrl = requiredEnv("TARGET_DATABASE_URL");

  const source = new PrismaClient({
    datasources: {
      db: {
        url: sourceDatabaseUrl,
      },
    },
  });
  const target = new PrismaClient({
    datasources: {
      db: {
        url: targetDatabaseUrl,
      },
    },
  });

  try {
    const [sourceSnapshot, targetSnapshot] = await Promise.all([
      loadSnapshot(source),
      loadSnapshot(target),
    ]);

    const mismatches: string[] = [];

    for (const [key, sourceValue] of Object.entries(sourceSnapshot.counts)) {
      const targetValue =
        targetSnapshot.counts[key as keyof DbSnapshot["counts"]];
      if (sourceValue !== targetValue) {
        mismatches.push(
          `Count mismatch for ${key}: source=${sourceValue}, target=${targetValue}`
        );
      }
    }

    const postSlugDiff = diffStrings(
      sourceSnapshot.postSlugs,
      targetSnapshot.postSlugs
    );
    const seriesSlugDiff = diffStrings(
      sourceSnapshot.seriesSlugs,
      targetSnapshot.seriesSlugs
    );
    const seriesPostCountDiff = diffSeriesCounts(
      sourceSnapshot.seriesPostCounts,
      targetSnapshot.seriesPostCounts
    );

    if (postSlugDiff.missingInTarget.length > 0) {
      mismatches.push(
        `Missing post slugs in target: ${postSlugDiff.missingInTarget.join(", ")}`
      );
    }
    if (postSlugDiff.extraInTarget.length > 0) {
      mismatches.push(
        `Unexpected post slugs in target: ${postSlugDiff.extraInTarget.join(", ")}`
      );
    }
    if (seriesSlugDiff.missingInTarget.length > 0) {
      mismatches.push(
        `Missing series slugs in target: ${seriesSlugDiff.missingInTarget.join(", ")}`
      );
    }
    if (seriesSlugDiff.extraInTarget.length > 0) {
      mismatches.push(
        `Unexpected series slugs in target: ${seriesSlugDiff.extraInTarget.join(", ")}`
      );
    }
    if (seriesPostCountDiff.length > 0) {
      mismatches.push(
        `Series post count mismatches: ${seriesPostCountDiff
          .map(
            (item) =>
              `${item.slug}(source=${item.source}, target=${item.target})`
          )
          .join(", ")}`
      );
    }

    console.log("=== Source Counts ===");
    console.table(sourceSnapshot.counts);
    console.log("=== Target Counts ===");
    console.table(targetSnapshot.counts);

    if (mismatches.length > 0) {
      console.error("=== Migration mismatches detected ===");
      for (const message of mismatches) {
        console.error(`- ${message}`);
      }
      process.exit(1);
    }

    console.log("Migration comparison passed.");
  } finally {
    await Promise.all([source.$disconnect(), target.$disconnect()]);
  }
}

main().catch((error) => {
  console.error("db:compare failed");
  console.error(error);
  process.exit(1);
});
