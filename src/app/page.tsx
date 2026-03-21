import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturedAdresses from "@/components/home/FeaturedAdresses";
import LatestArticles from "@/components/home/LatestArticles";
import { getFeaturedAdresses, getLatestBlogPosts } from "@/lib/api";

export default async function HomePage() {
  const [featuredAdresses, latestPosts] = await Promise.all([
    getFeaturedAdresses(4),
    getLatestBlogPosts(3),
  ]);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturedAdresses adresses={featuredAdresses} />
      <LatestArticles posts={latestPosts} />
    </>
  );
}
