import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSlugVariants, normalizeSlugFromPathParam } from "@/lib/slug";
import { pickRelatedPosts } from "@/lib/research/postDetail";
import PostDetailClient from "./PostDetailClient";
import type { Level } from "@/lib/research/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jaehkim-research.vercel.app";

/** Find post by slug; tries NFC first, then NFD for existing DB rows. */
async function findPostBySlug(
  slug: string,
  options?: { select?: object; include?: object }
) {
  const slugs = getSlugVariants(slug);
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
  const slug = normalizeSlugFromPathParam(params.slug);
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
  const slug = normalizeSlugFromPathParam(params.slug);
  const post = await findPostBySlug(slug, {
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      content: true,
      tags: true,
      level: true,
      date: true,
      updatedAt: true,
      viewCount: true,
      seriesId: true,
      seriesOrder: true,
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!post) notFound();

  const [comments, prevPost, nextPost, relatedCandidates] = await Promise.all([
    prisma.comment.findMany({
      where: { postId: post.id, parentId: null },
      orderBy: { createdAt: "desc" },
      include: {
        replies: { orderBy: { createdAt: "asc" } },
      },
    }),
    prisma.post.findFirst({
      where: {
        published: true,
        seriesId: null,
        date: { lt: post.date },
      },
      orderBy: { date: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
      },
    }),
    prisma.post.findFirst({
      where: {
        published: true,
        seriesId: null,
        date: { gt: post.date },
      },
      orderBy: { date: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
      },
    }),
    post.tags.length === 0
      ? Promise.resolve([])
      : prisma.post.findMany({
          where: {
            published: true,
            seriesId: null,
            id: { not: post.id },
            tags: { hasSome: post.tags },
          },
          orderBy: { date: "desc" },
          take: 12,
          select: {
            id: true,
            slug: true,
            title: true,
            summary: true,
            tags: true,
            date: true,
          },
        }),
  ]);

  const relatedPosts = pickRelatedPosts(post.tags, relatedCandidates);

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
      "@id": `${SITE_URL}/research/${post.slug}`,
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
        navigation={{
          prevPost: prevPost
            ? {
                id: prevPost.id,
                slug: prevPost.slug,
                title: prevPost.title,
                summary: prevPost.summary,
              }
            : null,
          nextPost: nextPost
            ? {
                id: nextPost.id,
                slug: nextPost.slug,
                title: nextPost.title,
                summary: nextPost.summary,
              }
            : null,
          relatedPosts,
        }}
        initialComments={initialComments}
        canonicalUrl={`${SITE_URL}/research/${post.slug}`}
      />
    </>
  );
}
