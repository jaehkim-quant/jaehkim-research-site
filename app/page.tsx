import { HeroSection } from "@/components/research/sections/HeroSection";
import { FeaturedResearchSection } from "@/components/research/sections/FeaturedResearchSection";
import { LatestPostsSection } from "@/components/research/sections/LatestPostsSection";
import { NewsletterSection } from "@/components/research/sections/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedResearchSection />
      <LatestPostsSection />
      <NewsletterSection />
    </>
  );
}
