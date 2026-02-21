import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostDetailClient from "./PostDetailClient";
import type { Level } from "@/lib/research/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jaehkim-research.vercel.app";

/** Normalize slug for lookup: decode and NFC so URL and DB match (e.g. Korean slugs). */
function normalizeSlug(slug: string | undefined): string {
  if (!slug || typeof slug !== "string") return "";
  try {
    const decoded = decodeURIComponent(slug);
    return decoded.normalize("NFC").trim();
  } catch {
    return slug.normalize("NFC").trim();
  }
}

/** Find post by slug; tries NFC first, then NFD for existing DB rows. */
async function findPostBySlug(
  slug: string,
  options?: { select?: object; include?: object }
) {
  const nfc = slug.normalize("NFC");
  const nfd = slug.normalize("NFD");
  const slugs = nfc !== nfd ? [nfc, nfd] : [nfc];
  return prisma.post.findFirst({
    where: { slug: { in: slugs } },
    ...options,
  });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = normalizeSlug(params.slug);
  const post = await findPostBySlug(slug, {
    select: {
      title: true,
      summary: true,
      slug: true,
      tags: true,
    },
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const title = post.title;
  const description = post.summary.slice(0, 160);
  const keywords = post.tags;

  return {
    title,
    description,
    keywords,
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE_URL}/research/${post.slug}`,
      siteName: "JaehKim Research",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/research/${post.slug}`,
    },
  };
}

export default async function ResearchDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = normalizeSlug(params.slug);
  const [post, allPosts, comments] = await Promise.all([
    findPostBySlug(slug, {
      include: {
        _count: { select: { likes: true, comments: true } },
      },
    }),
    prisma.post.findMany({
      where: { published: true, seriesId: null },
      orderBy: { date: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        tags: true,
        level: true,
        date: true,
        viewCount: true,
        seriesId: true,
        seriesOrder: true,
      },
    }),
    findPostBySlug(slug, { select: { id: true } }).then((p) =>
      !p
        ? []
        : prisma.comment.findMany({
            where: { postId: p.id, parentId: null },
            orderBy: { createdAt: "desc" },
            include: {
              replies: { orderBy: { createdAt: "asc" } },
            },
          })
    ),
  ]);

  if (!post) notFound();

  const initialComments = (comments ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    content: c.content,
    parentId: c.parentId,
    createdAt: c.createdAt.toISOString(),
    replies: (c.replies ?? []).map((r) => ({
      id: r.id,
      name: r.name,
      content: r.content,
      parentId: r.parentId!,
      createdAt: r.createdAt.toISOString(),
    })),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary.slice(0, 160),
    author: {
      "@type": "Person",
      name: "JaehKim",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "JaehKim Research",
      url: SITE_URL,
    },
    datePublished: post.date?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/research/${slug}`,
    },
    keywords: post.tags.join(", "),
    articleSection: "Research",
    inLanguage: "ko",
  };

  const postWithCount = post as typeof post & {
    _count: { likes: number; comments: number };
  };
  const initialPost = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    content: post.content ?? undefined,
    tags: post.tags,
    level: post.level as Level,
    date: post.date.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    viewCount: post.viewCount,
    likeCount: postWithCount._count.likes,
    commentCount: postWithCount._count.comments,
    seriesId: post.seriesId ?? undefined,
    seriesOrder: post.seriesOrder ?? undefined,
  };

  const initialAllPosts = allPosts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    summary: p.summary,
    tags: p.tags,
    level: p.level as Level,
    date: p.date.toISOString(),
    viewCount: p.viewCount,
  }));

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <PostDetailClient
        initialPost={initialPost}
        initialAllPosts={initialAllPosts}
        initialComments={initialComments}
        hasInitialCommentsFromServer
      />
    </>
  );
}
