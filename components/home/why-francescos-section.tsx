import React from "react";

const features = [
  {
    title: "Family Devotion",
    body: "Born from a family's devotion to one another. Every slice is a story, every bite a reminder that family is the greatest ingredient.",
  },
  {
    title: "Sicilian Heritage Since 1980s",
    body: "Over 40 years carrying forward authentic Sicilian flavors. Family traditions & recipes passed down by our Nonna.",
  },
  {
    title: "Fresh Dough Made Daily",
    body: "Never frozen. We make our dough fresh every single day using traditional methods.",
  },
  {
    title: "Hand-Tossed NY Style Pizza",
    body: "Authentic New York style pizza made the traditional way, hand-tossed and baked to perfection.",
  },
  {
    title: "A Gathering Place",
    body: "Each Francesco's table is a gathering place where strangers become friends & friends become family.",
  },
  {
    title: "From NY to Murrells Inlet",
    body: "From the bustling streets of New York to South Carolina, bringing authentic flavors to our new community.",
  },
  {
    title: "Catering for Events & Parties",
    body: "Planning an event? We offer catering services with the same quality you love.",
  },
  {
    title: "Rewards Program",
    body: "Earn points with every order and get rewarded for being part of the Francesco's family.",
  },
];

const WhyFrancescosSection: React.FC = () => {
  return (
    <section
      className="py-20"
      style={{
        background: 'rgba(192, 57, 43, 0.03)',
        borderTop: '1px solid rgba(192,57,43,0.15)',
        borderBottom: '1px solid rgba(192,57,43,0.15)',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-14">
            <p className="section-eyebrow">Excellence in Every Slice</p>
            <div className="section-divider"></div>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#f5f0e8]">
              Why Francesco's
            </h2>
            <p className="mt-4 text-[#b8b3ab] text-sm font-light max-w-xl mx-auto leading-relaxed">
              Over 40 years of Sicilian heritage &amp; family tradition, brought to the heart of Murrells Inlet.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 transition-all duration-300 hover:border-[rgba(192,57,43,0.4)]"
                style={{
                  background: '#1a0907',
                  border: '1px solid rgba(192,57,43,0.2)',
                  borderTop: '1px solid rgba(192,57,43,0.2)',
                }}
              >
                <div className="flex items-start space-x-4">
                  <span className="text-[#c0392b] mt-0.5 text-xs flex-shrink-0" aria-hidden="true">&#9670;</span>
                  <div>
                    <h3 className="font-playfair font-semibold text-lg text-[#f5f0e8] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-[#b8b3ab] text-sm font-light leading-relaxed">{feature.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div
            className="mt-14 py-10 px-8 text-center"
            style={{
              background: '#1a0907',
              border: '1px solid rgba(192,57,43,0.2)',
              borderTopWidth: '2px',
              borderTopStyle: 'solid',
              borderTopColor: 'transparent',
              backgroundImage: 'linear-gradient(#111111, #111111), linear-gradient(135deg, #7a1a14, #c0392b, #e74c3c, #c0392b, #7a1a14)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <p className="section-eyebrow mb-3">Join Our Family</p>
            <h3 className="font-playfair text-3xl font-bold text-[#f5f0e8] mb-4">
              Welcome to Our Family
            </h3>
            <p className="text-[#b8b3ab] text-sm font-light mb-8 max-w-md mx-auto leading-relaxed">
              Experience the warmth of our Sicilian heritage. Order online for pickup today.
            </p>
            <a
              href="/menu"
              className="inline-block px-10 py-3 text-sm font-bold tracking-widest uppercase text-[#f5f0e8] transition-opacity hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #7a1a14, #c0392b, #e74c3c, #c0392b, #7a1a14)',
              }}
            >
              Order Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyFrancescosSection;
