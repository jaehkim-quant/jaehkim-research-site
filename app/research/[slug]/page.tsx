import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostDetailClient from "./PostDetailClient";
import type { Level } from "@/lib/research/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jaehkim-research.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    select: {
      title: true,
      titleEn: true,
      summary: true,
      summaryEn: true,
      slug: true,
      tags: true,
      tagsEn: true,
    },
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const title = post.titleEn || post.title;
  const description = (post.summaryEn || post.summary).slice(0, 160);
  const keywords = [...(post.tagsEn || []), ...(post.tags || [])];

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
  const [post, allPosts] = await Promise.all([
    prisma.post.findUnique({
      where: { slug: params.slug },
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
        titleEn: true,
        slug: true,
        summary: true,
        summaryEn: true,
        tags: true,
        tagsEn: true,
        level: true,
        date: true,
        viewCount: true,
        seriesId: true,
        seriesOrder: true,
      },
    }),
  ]);

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.titleEn || post.title,
    description: (post.summaryEn || post.summary).slice(0, 160),
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
      "@id": `${SITE_URL}/research/${params.slug}`,
    },
    keywords: [...(post.tagsEn || []), ...(post.tags || [])].join(", "),
    articleSection: "Research",
    inLanguage: ["en", "ko"],
  };

  const initialPost = {
    id: post.id,
    title: post.title,
    titleEn: post.titleEn ?? undefined,
    slug: post.slug,
    summary: post.summary,
    summaryEn: post.summaryEn ?? undefined,
    content: post.content ?? undefined,
    contentEn: post.contentEn ?? undefined,
    tags: post.tags,
    tagsEn: post.tagsEn,
    level: post.level as Level,
    date: post.date.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    viewCount: post.viewCount,
    likeCount: post._count.likes,
    commentCount: post._count.comments,
    seriesId: post.seriesId ?? undefined,
    seriesOrder: post.seriesOrder ?? undefined,
  };

  const initialAllPosts = allPosts.map((p) => ({
    id: p.id,
    title: p.title,
    titleEn: p.titleEn ?? undefined,
    slug: p.slug,
    summary: p.summary,
    summaryEn: p.summaryEn ?? undefined,
    tags: p.tags,
    tagsEn: p.tagsEn,
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
      />
    </>
  );
}
