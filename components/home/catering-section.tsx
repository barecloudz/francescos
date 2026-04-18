import React from "react";
import Link from "next/link";

const CateringSection: React.FC = () => {
  return (
    <section className="bg-[#111111]">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
        {/* Left: Full-bleed photo */}
        <div
          className="relative h-80 lg:h-auto min-h-[400px] bg-cover bg-center"
          style={{ backgroundImage: "url('/images/gallery/photo-19.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Right: Content */}
        <div className="flex flex-col justify-center px-12 py-20 lg:px-20 lg:py-24">
          <p className="section-eyebrow mb-6">Events &amp; Gatherings</p>
          <h2 className="font-playfair text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Catering for<br />Any Occasion
          </h2>
          <p className="text-gray-400 text-base font-light leading-relaxed mb-10 max-w-md">
            From office parties to family gatherings, let Francesco's bring authentic NY pizza to your next event. Any group size, any occasion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/catering">
              <button className="px-10 py-4 text-sm font-bold tracking-widest uppercase text-white border border-white hover:bg-white hover:text-black transition-colors">
                Order Catering
              </button>
            </Link>
            <p className="self-center text-gray-500 text-xs tracking-widest uppercase">
              24hr advance notice required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CateringSection;
