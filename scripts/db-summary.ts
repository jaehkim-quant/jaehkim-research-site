import { PrismaClient } from "@prisma/client";

type DbSummary = {
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

function resolveDatabaseUrl() {
  return (
    process.env.MIGRATION_DATABASE_URL ||
    process.env.TARGET_DATABASE_URL ||
    process.env.DATABASE_URL
  );
}

async function loadSummary(prisma: PrismaClient): Promise<DbSummary> {
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
  ]);

  return {
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
  };
}

async function main() {
  const databaseUrl = resolveDatabaseUrl();

  if (!databaseUrl) {
    console.error(
      "Set MIGRATION_DATABASE_URL, TARGET_DATABASE_URL, or DATABASE_URL before running db:summary."
    );
    process.exit(1);
  }

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  try {
    const summary = await loadSummary(prisma);

    console.log("=== Database Summary ===");
    console.table(summary);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("db:summary failed");
  console.error(error);
  process.exit(1);
});
