"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-supabase-auth";

const HeroSection: React.FC = () => {
  const { user } = useAuth();

  const handleRewardsClick = () => {
    if (user) {
      // If logged in, navigate to rewards page
      window.location.href = '/rewards';
    } else {
      // If not logged in, scroll to rewards section
      const rewardsSection = document.getElementById('rewards');
      if (rewardsSection) {
        rewardsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative h-screen lg:h-[600px] bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-bg.jpeg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 text-center">
        <img src="/images/logo.png" alt="Francesco's Pizza & Pasta Logo" className="w-[140px] md:w-[170px] mb-4" loading="eager" fetchpriority="high" />
        <h1 className="text-3xl md:text-5xl font-display text-white font-bold mb-3">BEST NY PIZZA IN MURRELLS INLET</h1>
        <h2 className="text-xl md:text-2xl text-yellow-400 font-bold mb-4">Made with love for our community</h2>
        <p className="text-base md:text-lg text-white mb-6 max-w-2xl">
          Welcome to Francesco's Pizza & Pasta! For over 40 years, we've carried forward the flavors of our Sicilian heritage. Family traditions and recipes passed down by our Nonna, flavors seasoned with laughter, memories, and love.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <Link href="/menu">
            <Button className="bg-white hover:bg-gray-100 text-[#d73a31] px-6 md:px-8 py-4 md:py-6 text-lg rounded-full font-bold">ORDER ONLINE</Button>
          </Link>
          <Button 
            onClick={handleRewardsClick}
            variant="secondary" 
            className="bg-[#f2c94c] hover:bg-[#e0b93e] text-black px-6 md:px-8 py-4 md:py-6 text-lg rounded-full font-bold"
          >
            REWARDS
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
