import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import HeroSection from "@/components/home/hero-section";
import ChristmasPromoSection from "@/components/home/christmas-promo-section";
import FeaturedSection from "@/components/home/featured-section";
import CateringSection from "@/components/home/catering-section";
import WhyGenovasSection from "@/components/home/why-genovas-section";
import RewardsSection from "@/components/home/rewards-section";
import LocationSection from "@/components/home/location-section";
import SeoContentSection from "@/components/home/seo-content-section";
import FAQSection from "@/components/home/faq-section";
import Footer from "@/components/layout/footer";

const HomePage = () => {
  const { data: featuredItems } = useQuery({
    queryKey: ["/api/featured"],
  });

  return (
    <>
      <Helmet>
        <title>Best Pizza in Myrtle Beach | Pizza Near Me | Genova's Pizza & Pasta</title>
        <meta name="description" content="Best pizza in Myrtle Beach! Genova's Pizza & Pasta offers hand-tossed NY style pizza, pasta, calzones & subs. Family-owned pizzeria on Dick Pond Road. Order online for pickup!" />
        <meta name="keywords" content="pizza near me, best pizza in myrtle beach, pizza myrtle beach, myrtle beach pizza, pizza delivery myrtle beach, pizza place near me, pizzeria myrtle beach, Genovas Pizza, NY style pizza, hand tossed pizza, pasta myrtle beach, italian food myrtle beach" />
        <link rel="canonical" href="https://genovaspizzaandpasta.com/" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="Best Pizza in Myrtle Beach | Genova's Pizza & Pasta" />
        <meta property="og:description" content="Best pizza in Myrtle Beach! Genova's Pizza & Pasta offers hand-tossed NY style pizza, pasta, calzones & subs. Family-owned pizzeria." />
        <meta property="og:url" content="https://genovaspizzaandpasta.com/" />
        <meta property="og:type" content="restaurant" />
        <meta property="og:image" content="https://genovaspizzaandpasta.com/images/hero-bg.jpeg" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Best Pizza in Myrtle Beach | Genova's Pizza & Pasta" />
        <meta name="twitter:description" content="Best pizza in Myrtle Beach! Hand-tossed NY style pizza, pasta, calzones & subs." />
        <meta name="twitter:image" content="https://genovaspizzaandpasta.com/images/hero-bg.jpeg" />

        {/* Enhanced Restaurant & LocalBusiness Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            "name": "Genova's Pizza & Pasta",
            "alternateName": "Genovas Pizza",
            "description": "Family-owned authentic Italian pizzeria serving Myrtle Beach with hand-tossed NY style pizza, pasta, calzones, and subs. Over 40 years of Sicilian heritage.",
            "image": [
              "https://genovaspizzaandpasta.com/images/hero-bg.jpeg",
              "https://genovaspizzaandpasta.com/images/logopng.png"
            ],
            "logo": "https://genovaspizzaandpasta.com/images/logopng.png",
            "@id": "https://genovaspizzaandpasta.com/#restaurant",
            "url": "https://genovaspizzaandpasta.com/",
            "telephone": "+1-843-831-0800",
            "email": "genovapizzapasta@gmail.com",
            "priceRange": "$$",
            "servesCuisine": ["Pizza", "Italian", "Pasta", "New York Style Pizza"],
            "menu": "https://genovaspizzaandpasta.com/menu",
            "acceptsReservations": false,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "4620 Dick Pond Rd",
              "addressLocality": "Myrtle Beach",
              "addressRegion": "SC",
              "postalCode": "29588",
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "33.7376",
              "longitude": "-78.8531"
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "11:00",
                "closes": "21:00"
              }
            ],
            "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
            "currenciesAccepted": "USD",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Pizza & Pasta Menu",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "MenuItem",
                    "name": "NY Style Pizza",
                    "description": "Authentic hand-tossed New York style pizza"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "MenuItem",
                    "name": "Fresh Pasta",
                    "description": "Authentic Italian pasta dishes"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "MenuItem",
                    "name": "Calzones",
                    "description": "Fresh baked calzones with your choice of fillings"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "MenuItem",
                    "name": "Subs & Wraps",
                    "description": "Delicious subs and pizza wraps"
                  }
                }
              ]
            }
          })}
        </script>

        {/* Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Genova's Pizza & Pasta",
            "alternateName": "Genovas Pizza Myrtle Beach",
            "url": "https://genovaspizzaandpasta.com/",
            "logo": "https://genovaspizzaandpasta.com/images/logopng.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-843-831-0800",
              "contactType": "customer service",
              "areaServed": "US",
              "availableLanguage": "en"
            },
            "sameAs": [
              "https://www.facebook.com/profile.php?id=61580096004134",
              "https://www.instagram.com/genovasmyrtlebeach/",
              "https://www.tiktok.com/@genovasofmyrtlebeach"
            ]
          })}
        </script>

        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://genovaspizzaandpasta.com/"
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen lg:pt-20 pt-12">
        {/* Hero Section */}
        <HeroSection />

        {/* Christmas Promo Section - Only shows in December */}
        <ChristmasPromoSection />

        {/* Featured Section */}
        <FeaturedSection menuItems={featuredItems} />

        {/* Catering Section */}
        <CateringSection />

        {/* Why Genova's Section - Competitive advantages */}
        <WhyGenovasSection />

        {/* SEO Content Section - Rich keyword content for search engines */}
        <SeoContentSection />

        {/* Rewards Section */}
        <RewardsSection />

        {/* Location Section */}
        <LocationSection />

        {/* FAQ Section - Optimized for voice search */}
        <FAQSection />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
