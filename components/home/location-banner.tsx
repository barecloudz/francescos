import React from "react";
import Link from "next/link";

const LocationBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden" style={{ height: '520px' }}>
      {/* Background photo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/f2.jpg')" }}
      />
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
