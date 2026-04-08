import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  basePrice: string;
  imageUrl?: string;
  category: string;
  isPopular?: boolean;
  isBestSeller?: boolean;
}

interface FeaturedSectionProps {
  menuItems?: MenuItem[];
}

const staticItems = [
  {
    id: 1,
    image: "/images/f1.png",
    alt: "Traditional Pizza",
    name: "Traditional Pizza",
    description: "Our classic thin crust pizza with perfect New York style fold, topped with premium mozzarella and our signature sauce.",
  },
  {
    id: 2,
    image: "/images/f2.jpg",
    alt: "Grandma Caprese Pizza",
    name: "Grandma Caprese",
    description: "Fresh mozzarella, ripe tomatoes, fresh basil, and extra virgin olive oil on our signature grandma-style crust.",
  },
  {
    id: 3,
    image: "/images/f3.jpg",
    alt: "Stromboli",
    name: "Stromboli",
    description: "Rolled with savory Italian meats, cheeses, and vegetables, then baked to golden perfection with our fresh dough.",
  },
];

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ menuItems }) => {
  const hasMenuItems = menuItems && menuItems.length > 0;

  return (
    <section className="py-20 bg-[#0a0a0a]" id="featured">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="section-eyebrow">From Our Kitchen</p>
          <div className="section-divider"></div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#f5f0e8]">
            Customer Favorites
          </h2>
          <p className="mt-4 text-[#888888] text-sm font-light max-w-2xl mx-auto leading-relaxed">
            The best pizza in Murrells Inlet — authentic New York style pizzas made with Italian family recipes
            passed down through generations. Order online for pickup and experience Sicilian tradition.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hasMenuItems
            ? menuItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden transition-all duration-300 hover:border-[rgba(192,57,43,0.5)] group"
                  style={{
                    background: '#111111',
                    border: '1px solid rgba(192,57,43,0.2)',
                    borderTopWidth: '2px',
                    borderTopColor: '#c0392b',
                  }}
                >
                  <div className="h-56 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name || 'Menu Item'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                        <span className="text-4xl opacity-30">&#127829;</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-playfair text-xl font-semibold text-[#f5f0e8] mb-2">
                      {item.name || 'Unknown Item'}
                    </h3>
                    <p className="text-[#888888] text-sm font-light mb-3 leading-relaxed">{item.description}</p>
                    <p
                      className="text-sm font-bold text-[#c0392b] mb-5 tracking-widest uppercase"
                      style={{ fontSize: '0.7rem', letterSpacing: '0.2em' }}
                    >
                      From ${item.basePrice}
                    </p>
                    <Link href={`/menu?item=${item.id}`}>
                      <Button
                        className="w-full text-xs font-bold tracking-widest uppercase text-[#f5f0e8] border-0"
                        style={{ background: 'linear-gradient(135deg, #7a1a14, #c0392b, #e74c3c, #c0392b, #7a1a14)' }}
                      >
                        Order Now
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            : staticItems.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden transition-all duration-300 hover:border-[rgba(192,57,43,0.5)] group"
                  style={{
                    background: '#111111',
                    border: '1px solid rgba(192,57,43,0.2)',
                    borderTopWidth: '2px',
                    borderTopColor: '#c0392b',
                  }}
                >
                  <div className="h-56 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-playfair text-xl font-semibold text-[#f5f0e8] mb-2">{item.name}</h3>
                    <p className="text-[#888888] text-sm font-light mb-5 leading-relaxed">{item.description}</p>
                    <Link href="/menu">
                      <Button
                        className="w-full text-xs font-bold tracking-widest uppercase text-[#f5f0e8] border-0"
                        style={{ background: 'linear-gradient(135deg, #7a1a14, #c0392b, #e74c3c, #c0392b, #7a1a14)' }}
                      >
                        Order Now
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
        </div>

        {/* View full menu CTA */}
        <div className="mt-14 text-center">
          <Link href="/menu">
            <button
              className="px-12 py-4 text-xs font-bold tracking-widest uppercase text-[#f5f0e8] transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #7a1a14, #c0392b, #e74c3c, #c0392b, #7a1a14)' }}
            >
              View Full Menu
            </button>
          </Link>
          <p className="mt-4 text-[#888888] text-xs tracking-widest uppercase font-light" style={{ fontSize: '0.65rem', letterSpacing: '0.2em' }}>
            Discover all our authentic Italian specialties
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
