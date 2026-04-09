"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const SeoContentSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="py-12 bg-[#0a0a0a]" style={{ borderTop: '1px solid rgba(192,57,43,0.1)' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Toggle button */}
          <div className="text-center mb-6">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center px-6 py-3 text-xs font-bold tracking-widest uppercase bg-transparent text-[#c0392b] transition-colors hover:text-[#f5f0e8]"
              style={{ border: '1px solid rgba(192,57,43,0.4)', fontSize: '0.65rem', letterSpacing: '0.2em' }}
            >
              {isExpanded ? (
                <>
                  Hide About Us <ChevronUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  About Francesco's Pizza <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="text-center mb-8">
              <p className="section-eyebrow mb-0">Murrells Inlet, South Carolina</p>
              <div className="section-divider"></div>
              <h3 className="font-playfair text-3xl md:text-4xl font-bold text-[#f5f0e8]">
                Best Pizza in Murrells Inlet, SC
              </h3>
              <p className="mt-2 text-[#b8b3ab] text-xs font-light tracking-widest uppercase" style={{ letterSpacing: '0.2em' }}>
                Authentic NY Style Pizza
              </p>
            </div>

            <div className="space-y-8" style={{ borderTop: '1px solid rgba(192,57,43,0.15)', paddingTop: '2rem' }}>
              <div>
                <h2 className="font-playfair text-2xl font-bold mb-3 text-[#f5f0e8]">
                  Authentic Sicilian Heritage — Over 40 Years of Family Tradition
                </h2>
                <p className="text-[#b8b3ab] text-sm font-light leading-relaxed">
                  Welcome to <strong className="text-[#e8e3dc] font-normal">Francesco's Pizza Kitchen</strong>, Murrells Inlet's destination for{" "}
                  <strong className="text-[#e8e3dc] font-normal">authentic NY style pizza</strong>,{" "}
                  <strong className="text-[#e8e3dc] font-normal">fresh pasta</strong>, and traditional Italian cuisine.
                  As a family-owned restaurant carrying forward over 40 years of Sicilian heritage, we've been serving the{" "}
                  <strong className="text-[#e8e3dc] font-normal">best pizza in Murrells Inlet</strong> with recipes passed down by our Nonna.
                  Our commitment to traditional recipes and fresh, quality ingredients makes every bite a taste of home.
                </p>
              </div>

              <div>
                <h2 className="font-playfair text-2xl font-bold mb-3 text-[#f5f0e8]">
                  Hand-Tossed NY Style Pizza in Murrells Inlet
                </h2>
                <p className="text-[#b8b3ab] text-sm font-light leading-relaxed">
                  Looking for <strong className="text-[#e8e3dc] font-normal">pizza near me in Murrells Inlet</strong>? Look no further! Our{" "}
                  <strong className="text-[#e8e3dc] font-normal">New York style pizza</strong> features a perfectly thin, crispy crust that folds just right,
                  topped with our signature sauce made from fresh Italian tomatoes and premium mozzarella cheese.
                  Every pie is hand-tossed and baked to perfection. We also serve delicious{" "}
                  <strong className="text-[#e8e3dc] font-normal">Sicilian style pizza</strong> with a thick, fluffy crust that's a local favorite.
                </p>
              </div>

              <div>
                <h2 className="font-playfair text-2xl font-bold mb-3 text-[#f5f0e8]">
                  Calzones, Pasta &amp; Italian Specialties
                </h2>
                <p className="text-[#b8b3ab] text-sm font-light leading-relaxed">
                  Beyond our award-winning pizza, Francesco's offers an extensive menu of{" "}
                  <strong className="text-[#e8e3dc] font-normal">Italian food in Murrells Inlet</strong>. Our{" "}
                  <strong className="text-[#e8e3dc] font-normal">calzones</strong> are hand-folded masterpieces, stuffed with ricotta, mozzarella, and your choice of
                  premium toppings. Try our fresh <strong className="text-[#e8e3dc] font-normal">pasta dishes</strong> — from classic spaghetti and meatballs
                  to creamy fettuccine alfredo, each dish is made with love and authentic Italian flavors.
                </p>
              </div>

              <div>
                <h3 className="font-playfair text-xl font-bold mb-4 text-[#f5f0e8]">Our Menu Features</h3>
                <ul className="space-y-2">
                  {[
                    ['NY Style Pizza', 'Thin crust, hand-tossed perfection'],
                    ['Sicilian Square Pizza', 'Thick, fluffy crust with robust flavors'],
                    ['Gourmet Calzones', 'Stuffed with premium ingredients'],
                    ['Fresh Pasta', 'Classic Italian dishes made daily'],
                    ['Subs & Wraps', 'Hearty sandwiches and pizza wraps'],
                    ['Fresh Salads', 'Crisp greens with house-made dressings'],
                    ['Appetizers', 'Garlic knots, mozzarella sticks, and more'],
                  ].map(([name, desc]) => (
                    <li key={name} className="flex items-start space-x-3">
                      <span className="text-[#c0392b] mt-1 text-xs flex-shrink-0" aria-hidden="true">&#9670;</span>
                      <span className="text-[#b8b3ab] text-sm font-light">
                        <strong className="text-[#e8e3dc] font-normal">{name}</strong> — {desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-playfair text-2xl font-bold mb-3 text-[#f5f0e8]">
                  Order Online for Pickup in Murrells Inlet, SC
                </h2>
                <p className="text-[#b8b3ab] text-sm font-light leading-relaxed">
                  Craving <strong className="text-[#e8e3dc] font-normal">pizza in Murrells Inlet</strong>? Order online for fast, convenient pickup.
                  Searching for <strong className="text-[#e8e3dc] font-normal">best pizza near me</strong> or{" "}
                  <strong className="text-[#e8e3dc] font-normal">Italian food near me</strong>? Francesco's offers
                  easy online ordering — just place your order and we'll have your food ready when you arrive.
                  Our online ordering system makes it easy to customize your pizza, add sides, and earn rewards points with every order.
                </p>
              </div>

              <div>
                <h2 className="font-playfair text-2xl font-bold mb-3 text-[#f5f0e8]">
                  Why Francesco's is the Best Pizza in Murrells Inlet
                </h2>
                <ul className="space-y-2">
                  {[
                    'Over 40 years of Sicilian family heritage',
                    'Fresh, high-quality ingredients sourced daily',
                    'Hand-tossed dough made fresh every day',
                    'Traditional Italian cooking methods',
                    'Family recipes passed down by Nonna',
                    'Convenient online ordering for pickup',
                    'Catering available for events and parties',
                    'Rewards program for loyal customers',
                  ].map((item) => (
                    <li key={item} className="flex items-start space-x-3">
                      <span className="text-[#c0392b] mt-1 text-xs flex-shrink-0" aria-hidden="true">&#9670;</span>
                      <span className="text-[#b8b3ab] text-sm font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Location & Service Area */}
              <div
                className="p-6"
                style={{
                  background: '#111111',
                  border: '1px solid rgba(192,57,43,0.2)',
                  borderLeft: '2px solid #c0392b',
                }}
              >
                <h3 className="font-playfair text-lg font-bold mb-3 text-[#f5f0e8]">
                  Serving Murrells Inlet &amp; Surrounding Areas
                </h3>
                <p className="text-[#b8b3ab] text-sm font-light mb-3 leading-relaxed">
                  <strong className="text-[#e8e3dc] font-normal">Murrells Inlet Pizza:</strong> We proudly serve customers from across the Grand Strand area
                  including Murrells Inlet, Surfside Beach, Garden City, and surrounding communities in South Carolina.
                </p>
                <p className="text-[#b8b3ab] text-sm font-light leading-relaxed">
                  <strong className="text-[#e8e3dc] font-normal">Our Location:</strong> Visit us at 2520 US-17 BUS, Murrells Inlet, SC 29576.
                  Order online for pickup and enjoy the best NY style pizza in town.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeoContentSection;
