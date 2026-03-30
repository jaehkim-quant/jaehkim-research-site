import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/research/sections/HeroSection";
import { FeaturedResearchSection } from "@/components/research/sections/FeaturedResearchSection";
import { LatestPostsSection } from "@/components/research/sections/LatestPostsSection";
import { NewsletterSection } from "@/components/research/sections/NewsletterSection";
import type { Level } from "@/lib/research/types";
import { resolveSiteUrl } from "@/lib/site";

const SITE_URL = resolveSiteUrl();
export const dynamic = "force-dynamic";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "JaehKim Research",
  url: SITE_URL,
  description:
    "Reproducible, verified, risk-focused quant research. Data-driven insights for individual investors and fellow researchers.",
  author: {
    "@type": "Person",
    name: "JaehKim",
  },
  inLanguage: "ko",
};

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
    take: 10,
    include: {
      _count: { select: { likes: true, comments: true } },
    },
  });

  const serialized = posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    summary: p.summary,
    tags: p.tags,
    level: p.level as Level,
    date: p.date.toISOString(),
    viewCount: p.viewCount,
    likeCount: p._count.likes,
    commentCount: p._count.comments,
  }));

  const featuredPosts = serialized.slice(0, 6);
  const latestPosts = serialized.slice(0, 5);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HeroSection />
      <FeaturedResearchSection initialPosts={featuredPosts} />
      <LatestPostsSection initialPosts={latestPosts} />
      <NewsletterSection />
    </>
  );
}
