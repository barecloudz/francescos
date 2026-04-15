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
    <section className="py-32 md:py-40 bg-[#fafaf8]" id="featured">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="section-eyebrow">From Our Kitchen</p>
          <div className="section-divider"></div>
          <h2 className="font-playfair text-5xl md:text-7xl font-bold text-[#111111]">
            Customer Favorites
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hasMenuItems
            ? menuItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden transition-all duration-300 hover:border-[rgba(192,57,43,0.4)] group"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5e0d8',
                    borderTopWidth: '2px',
                    borderTopColor: '#c0392b',
                  }}
                >
                  <div className="h-72 md:h-80 overflow-hidden">
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
                  <div className="p-8">
                    <h3 className="font-playfair text-2xl font-semibold text-[#111111] mb-2">
                      {item.name || 'Unknown Item'}
                    </h3>
                    <p className="text-[#555555] text-sm font-light mb-5 leading-relaxed line-clamp-2">{item.description}</p>
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
                  className="overflow-hidden transition-all duration-300 hover:border-[rgba(192,57,43,0.4)] group"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5e0d8',
                    borderTopWidth: '2px',
                    borderTopColor: '#c0392b',
                  }}
                >
                  <div className="h-72 md:h-80 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="font-playfair text-2xl font-semibold text-[#111111] mb-2">{item.name}</h3>
                    <p className="text-[#555555] text-sm font-light mb-5 leading-relaxed line-clamp-2">{item.description}</p>
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
            <button className="px-16 py-5 text-xs font-bold tracking-widest uppercase border border-[#111111] bg-transparent text-[#111111] hover:bg-[#111111] hover:text-white transition-colors">
              View Full Menu
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
