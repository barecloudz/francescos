"use client";

import React from "react";
import { NeighborhoodData } from "@/data/neighborhoods";
import NeighborhoodHero from "./neighborhood-hero";
import NeighborhoodContent from "./neighborhood-content";
import NeighborhoodTestimonials from "./neighborhood-testimonials";
import NeighborhoodMap from "./neighborhood-map";

interface NeighborhoodPageTemplateProps {
  data: NeighborhoodData;
}

const NeighborhoodPageTemplate: React.FC<NeighborhoodPageTemplateProps> = ({ data }) => {
  return (
    <div className="min-h-screen lg:pt-20 pt-12">
      {/* Hero Section */}
      <NeighborhoodHero
        neighborhoodName={data.name}
        subheadline={data.heroSubheadline}
        distanceFromFrancescos={data.distanceFromFrancescos}
        deliveryTime={data.deliveryTime}
      />

      {/* Main Content Section */}
      <NeighborhoodContent
        neighborhoodName={data.name}
        introText={data.introText}
        areasServed={data.areasServed}
        landmarks={data.landmarks}
        localAnecdote={data.localAnecdote}
        keywords={data.keywords}
      />

      {/* Testimonials Section */}
      <NeighborhoodTestimonials
        neighborhoodName={data.name}
        testimonials={data.testimonials}
      />

      {/* Map Section */}
      <NeighborhoodMap neighborhoodName={data.name} />
    </div>
  );
};

export default NeighborhoodPageTemplate;
