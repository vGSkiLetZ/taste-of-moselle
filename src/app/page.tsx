import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturedAdresses from "@/components/home/FeaturedAdresses";
import LatestArticles from "@/components/home/LatestArticles";
import MiniMapSection from "@/components/home/MiniMapSection";
import InstagramFeed from "@/components/home/InstagramFeed";
import SuggestCTA from "@/components/home/SuggestCTA";
import { getFeaturedAdresses, getLatestBlogPosts, getAllAdresses } from "@/lib/api";

export default async function HomePage() {
  const [featuredAdresses, latestPosts, allAdresses] = await Promise.all([
    getFeaturedAdresses(4),
    getLatestBlogPosts(3),
    getAllAdresses(),
  ]);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturedAdresses adresses={featuredAdresses} />
      <MiniMapSection adresses={allAdresses} />
      <LatestArticles posts={latestPosts} />
      <InstagramFeed />
      <SuggestCTA />
    </>
  );
}
