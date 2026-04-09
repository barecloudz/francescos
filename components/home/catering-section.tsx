import React from "react";
import Link from "next/link";
import { UtensilsCrossed, Users, Calendar, Phone } from "lucide-react";

const features = [
  {
    icon: Users,
    label: "Group Size",
    title: "Any Group Size",
    body: "Whether it's 10 or 100+ guests, we've got you covered with delicious pizza.",
  },
  {
    icon: Calendar,
    label: "Scheduling",
    title: "Easy Scheduling",
    body: "Book your catering order online and schedule pickup or delivery.",
  },
  {
    icon: Phone,
    label: "Service",
    title: "Personal Service",
    body: "Our team will help customize the perfect menu for your event.",
  },
];

const CateringSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-14">
            <p className="section-eyebrow">Events &amp; Gatherings</p>
            <div className="section-divider"></div>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#f5f0e8]">
              Catering for Any Occasion
            </h2>
            <p className="mt-4 text-[#b8b3ab] text-sm font-light max-w-xl mx-auto leading-relaxed">
              From office parties to family gatherings, let Francesco's bring authentic NY pizza to your next event.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {features.map(({ icon: Icon, label, title, body }) => (
              <div
                key={title}
                className="p-8 text-center transition-all duration-300 hover:border-[rgba(192,57,43,0.4)]"
                style={{
                  background: '#1a0907',
                  border: '1px solid rgba(192,57,43,0.2)',
                  borderTopWidth: '2px',
                  borderTopColor: '#c0392b',
                }}
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 mb-5"
                  style={{ border: '1px solid rgba(192,57,43,0.3)', background: 'rgba(192,57,43,0.06)' }}
                >
                  <Icon className="w-5 h-5 text-[#c0392b]" />
                </div>
                <p className="section-eyebrow mb-2">{label}</p>
                <h3 className="font-playfair text-lg font-semibold text-[#f5f0e8] mb-3">{title}</h3>
                <p className="text-[#b8b3ab] text-sm font-light leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/catering">
              <button
                className="inline-flex items-center px-10 py-4 text-xs font-bold tracking-widest uppercase text-[#f5f0e8] transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #7a1a14, #c0392b, #e74c3c, #c0392b, #7a1a14)' }}
              >
                <UtensilsCrossed className="w-4 h-4 mr-2" />
                Order Catering
              </button>
            </Link>
            <p className="mt-4 text-[#b8b3ab] text-xs font-light tracking-widest uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.2em' }}>
              Perfect for office lunches, birthday parties, game days &amp; more
            </p>
            <p className="mt-2 text-[#999999] text-xs font-light" style={{ fontSize: '0.65rem' }}>
              Please submit catering orders at least 24 hours in advance
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CateringSection;
