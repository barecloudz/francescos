"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-supabase-auth";

const HeroSection: React.FC = () => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    '/images/gallery/photo-02.jpg',
    '/images/gallery/photo-05.jpg',
    '/images/gallery/photo-08.jpg',
    '/images/gallery/photo-13.jpg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(i => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

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
    <section className="relative h-screen overflow-hidden">
      {/* Crossfade slides */}
      {slides.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url('${src}')` }}
        />
      ))}
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0a0a0a]/70"></div>
      {/* Radial red glow from top */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(192,57,43,0.12) 0%, transparent 65%)',
        }}
      ></div>

      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 text-center pt-24 lg:pt-44">
        {/* Eyebrow label */}
        <p className="section-eyebrow mb-0">Murrells Inlet, South Carolina</p>

        {/* Divider */}
        <div className="section-divider"></div>

        {/* Main headline */}
        <h1
          className="font-playfair text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight text-white"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
        >
          Best Pizza in Murrells Inlet
        </h1>

        {/* Divider below heading */}
        <div className="section-divider"></div>

        {/* Subheadline */}
        <p
          className="text-[#c8c2bb] mb-10 max-w-xl"
          style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
        >
          Made with love for our community
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-5">
          <Link href="/menu">
            <Button
              className="px-12 py-5 text-sm font-bold tracking-widest uppercase text-[#f5f0e8] border-0"
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
            className="px-12 py-5 text-sm font-bold tracking-widest uppercase bg-transparent text-white border border-white/40 hover:bg-white/10 transition-colors"
          >
            Rewards
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
