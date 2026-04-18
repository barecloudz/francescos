'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";

const images = [
  "/images/gallery/photo-02.jpg",
  "/images/gallery/photo-03.jpg",
  "/images/gallery/photo-04.jpg",
  "/images/gallery/photo-05.jpg",
  "/images/gallery/photo-06.jpg",
  "/images/gallery/photo-07.jpg",
  "/images/gallery/photo-08.jpg",
  "/images/gallery/photo-10.jpg",
  "/images/gallery/photo-11.jpg",
  "/images/gallery/photo-12.jpg",
  "/images/gallery/photo-13.jpg",
  "/images/gallery/photo-15.jpg",
  "/images/gallery/photo-16.jpg",
  "/images/gallery/photo-18.jpg",
  "/images/gallery/photo-19.jpg",
  "/images/gallery/photo-20.jpg",
];

const LocationBanner: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden" style={{ height: '520px' }}>
      {/* Sliding background photos */}
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${src}')`,
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Massive watermark city name */}
      <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none">
        <p
          className="font-playfair font-bold text-white select-none whitespace-nowrap"
          style={{
            fontSize: 'clamp(80px, 13vw, 180px)',
            lineHeight: 1,
            opacity: 0.07,
            letterSpacing: '-0.02em',
            paddingLeft: '2vw',
          }}
        >
          MURRELLS INLET
        </p>
      </div>

      {/* Content pinned to bottom-left */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-14 px-8 md:px-16 lg:px-24">
        <p
          className="text-white/50 mb-3"
          style={{ fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase' }}
        >
          2520 US-17 BUS &mdash; Murrells Inlet, SC 29576
        </p>
        <h2
          className="font-playfair font-bold text-white mb-8"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.1 }}
        >
          Murrells Inlet,<br />South Carolina
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/menu">
            <button className="px-8 py-3 text-xs font-bold tracking-widest uppercase text-white border border-white hover:bg-white hover:text-black transition-colors">
              Order Online
            </button>
          </Link>
          <Link href="/catering">
            <button className="px-8 py-3 text-xs font-bold tracking-widest uppercase text-white border border-white/50 hover:border-white hover:bg-white hover:text-black transition-colors">
              Catering
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LocationBanner;
