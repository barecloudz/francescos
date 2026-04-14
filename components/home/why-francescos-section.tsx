import React from "react";

const WhyFrancescosSection: React.FC = () => {
  return (
    <section className="bg-[#fafaf8]">
      {/* Stats section */}
      <div className="py-32 md:py-40">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-20">
              <p className="section-eyebrow">Excellence in Every Slice</p>
              <div className="section-divider"></div>
              <h2 className="font-playfair text-4xl md:text-6xl font-bold text-[#111111]">
                Why Francesco's
              </h2>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
              <div>
                <p className="font-playfair text-7xl font-bold text-[#c0392b] mb-3">40+</p>
                <p className="text-xs tracking-[0.3em] uppercase text-[#888888] mb-2">Years of</p>
                <p className="font-playfair text-xl font-semibold text-[#111111]">Sicilian Heritage</p>
              </div>
              <div>
                <p className="font-playfair text-7xl font-bold text-[#c0392b] mb-3">100%</p>
                <p className="text-xs tracking-[0.3em] uppercase text-[#888888] mb-2">Always</p>
                <p className="font-playfair text-xl font-semibold text-[#111111]">Fresh Daily Dough</p>
              </div>
              <div>
                <p className="font-playfair text-7xl font-bold text-[#c0392b] mb-3">NY</p>
                <p className="text-xs tracking-[0.3em] uppercase text-[#888888] mb-2">Authentic</p>
                <p className="font-playfair text-xl font-semibold text-[#111111]">Hand-Tossed Style</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-bleed dark CTA */}
      <div
        className="py-24 px-8 text-center"
        style={{
          background: '#111111',
          borderTop: '2px solid #c0392b',
        }}
      >
        <p className="section-eyebrow mb-3">Join Our Family</p>
        <h3 className="font-playfair text-4xl md:text-5xl font-bold text-[#f5f0e8] mb-4">
          Welcome to Our Family
        </h3>
        <p className="text-[#b8b3ab] text-sm font-light mb-8 max-w-md mx-auto leading-relaxed">
          Experience the warmth of our Sicilian heritage. Order online for pickup today.
        </p>
        <a
          href="/menu"
          className="inline-block px-12 py-4 text-sm font-bold tracking-widest uppercase text-white border border-white hover:bg-white hover:text-black transition-colors"
        >
          Order Now
        </a>
      </div>
    </section>
  );
};

export default WhyFrancescosSection;
