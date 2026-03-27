'use client';

import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/home/hero-section";
import ChristmasPromoSection from "@/components/home/christmas-promo-section";
import FeaturedSection from "@/components/home/featured-section";
import CateringSection from "@/components/home/catering-section";
import WhyFrancescosSection from "@/components/home/why-francescos-section";
import RewardsSection from "@/components/home/rewards-section";
import LocationSection from "@/components/home/location-section";
import SeoContentSection from "@/components/home/seo-content-section";
import FAQSection from "@/components/home/faq-section";

const HomePageContent = () => {
  const { data: featuredItems } = useQuery({
    queryKey: ["/api/featured"],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Christmas Promo Section - Only shows in December */}
      <ChristmasPromoSection />

      {/* Featured Section */}
      <FeaturedSection menuItems={featuredItems} />

      {/* Catering Section */}
      <CateringSection />

      {/* Why Francesco's Section - Competitive advantages */}
      <WhyFrancescosSection />

      {/* SEO Content Section - Rich keyword content for search engines */}
      <SeoContentSection />

      {/* Rewards Section */}
      <RewardsSection />

      {/* Location Section */}
      <LocationSection />

      {/* FAQ Section - Optimized for voice search */}
      <FAQSection />
    </div>
  );
};

export default HomePageContent;
