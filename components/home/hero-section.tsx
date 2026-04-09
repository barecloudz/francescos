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
    <section
      className="relative h-screen lg:h-[680px] bg-cover bg-center"
      style={{ backgroundImage: "url('/images/hero-bg.jpeg')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0a0a0a]/70"></div>
      {/* Radial red glow from top */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(192,57,43,0.12) 0%, transparent 65%)',
        }}
      ></div>

      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 text-center">
        <img
          src="/images/logo.png"
          alt="Francesco's Pizza Kitchen Logo"
          className="w-[130px] md:w-[160px] mb-6 opacity-95"
          loading="eager"
        />

        {/* Eyebrow label */}
        <p className="section-eyebrow mb-0">Murrells Inlet, South Carolina</p>

        {/* Divider */}
        <div className="section-divider"></div>

        {/* Main headline */}
        <h1
          className="font-playfair text-4xl md:text-6xl font-bold mb-4 leading-tight"
          style={{
            background: 'linear-gradient(135deg, #7a1a14, #c0392b, #e74c3c, #c0392b, #7a1a14)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Best NY Pizza in Murrells Inlet
        </h1>

        {/* Divider below heading */}
        <div className="section-divider"></div>

        {/* Subheadline */}
        <p
          className="text-[#c8c2bb] mb-2 max-w-xl"
          style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
        >
          Made with love for our community
        </p>

        {/* Body copy */}
        <p className="text-[#f0ece6] text-base md:text-lg mb-8 max-w-2xl leading-relaxed font-light mt-4" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>
          Welcome to Francesco's Pizza Kitchen. For over 40 years, we've carried forward the flavors
          of our Sicilian heritage — family traditions and recipes passed down by our Nonna,
          seasoned with laughter, memories, and love.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-5">
          <Link href="/menu">
            <Button
              className="px-8 py-5 text-sm font-bold tracking-widest uppercase text-[#f5f0e8] border-0"
              style={{
                background: 'linear-gradient(135deg, #7a1a14, #c0392b, #e74c3c, #c0392b, #7a1a14)',
                backgroundSize: '200% auto',
                transition: 'background-position 0.4s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundPosition = 'right center';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundPosition = 'left center';
              }}
            >
              Order Online
            </Button>
          </Link>
          <Button
            onClick={handleRewardsClick}
            variant="outline"
            className="px-8 py-5 text-sm font-bold tracking-widest uppercase bg-transparent text-[#c0392b] border border-[#c0392b] hover:bg-[rgba(192,57,43,0.08)] transition-colors"
          >
            Rewards
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
