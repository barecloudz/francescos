"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const SeoContentSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Collapsible About Us Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="outline"
              className="text-lg font-semibold text-[#d73a31] border-[#d73a31] hover:bg-[#d73a31] hover:text-white transition-colors"
            >
              {isExpanded ? (
                <>
                  Hide About Us <ChevronUp className="ml-2 h-5 w-5" />
                </>
              ) : (
                <>
                  About Francesco's Pizza <ChevronDown className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <h3 className="text-4xl md:text-5xl font-bold text-center mb-8 text-[#d73a31]">
              Best Pizza in Murrells Inlet, SC - Authentic NY Style Pizza
            </h3>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Authentic Sicilian Heritage - Over 40 Years of Family Tradition</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Welcome to <strong>Francesco's Pizza & Pasta</strong>, Murrells Inlet's destination for <strong>authentic NY style pizza</strong>,
              <strong> fresh pasta</strong>, and traditional Italian cuisine.
              As a family-owned restaurant carrying forward over 40 years of Sicilian heritage, we've been serving the
              <strong> best pizza in Murrells Inlet</strong> with recipes passed down by our Nonna.
              Our commitment to traditional recipes and fresh, quality ingredients makes every bite a taste of home.
            </p>

            <h2 className="text-3xl font-bold mb-4 text-gray-900">Hand-Tossed NY Style Pizza in Murrells Inlet</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Looking for <strong>pizza near me in Murrells Inlet</strong>? Look no further! Our <strong>New York style pizza</strong> features
              a perfectly thin, crispy crust that folds just right, topped with our signature sauce made from fresh Italian tomatoes
              and premium mozzarella cheese. Every pie is hand-tossed and baked to perfection in our traditional pizza ovens.
              We also serve delicious <strong>Sicilian style pizza</strong> with a thick, fluffy crust that's a local favorite.
            </p>

            <h2 className="text-3xl font-bold mb-4 text-gray-900">Calzones, Pasta & Italian Specialties</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Beyond our award-winning pizza, Francesco's offers an extensive menu of <strong>Italian food in Murrells Inlet</strong>.
              Our <strong>calzones</strong> are hand-folded masterpieces, stuffed with ricotta, mozzarella, and your choice of
              premium toppings. Try our fresh <strong>pasta dishes</strong> - from classic spaghetti and meatballs to creamy
              fettuccine alfredo, each dish is made with love and authentic Italian flavors.
            </p>

            <h3 className="text-2xl font-bold mb-3 text-gray-900">Our Menu Features:</h3>
            <ul className="list-disc list-inside mb-6 text-gray-700 space-y-2">
              <li><strong>NY Style Pizza</strong> - Thin crust, hand-tossed perfection</li>
              <li><strong>Sicilian Square Pizza</strong> - Thick, fluffy crust with robust flavors</li>
              <li><strong>Gourmet Calzones</strong> - Stuffed with premium ingredients</li>
              <li><strong>Fresh Pasta</strong> - Classic Italian dishes made daily</li>
              <li><strong>Subs & Wraps</strong> - Hearty sandwiches and pizza wraps</li>
              <li><strong>Fresh Salads</strong> - Crisp greens with house-made dressings</li>
              <li><strong>Appetizers</strong> - Garlic knots, mozzarella sticks, and more</li>
            </ul>

            <h4 className="text-2xl font-bold mb-2 text-gray-900">Pizza Near Me</h4>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Order Online for Pickup in Murrells Inlet, SC</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Craving <strong>pizza in Murrells Inlet</strong>? Order online for fast, convenient pickup.
              Searching for <strong>best pizza near me</strong> or <strong>Italian food near me</strong>? Francesco's offers
              easy online ordering - just place your order and we'll have your food ready when you arrive.
              Our online ordering system makes it easy to customize your pizza, add sides,
              and earn rewards points with every order.
            </p>

            <h2 className="text-3xl font-bold mb-4 text-gray-900">Family-Owned Italian Restaurant - Sicilian Heritage Since the 1980s</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              As a <strong>family-owned pizza restaurant in Murrells Inlet</strong>, we take pride in treating every customer like family.
              Our recipes have been perfected over generations, bringing true <strong>authentic NY pizza and Italian specialties</strong> to South Carolina.
              From the bustling streets of New York to the beautiful shores of Murrells Inlet, we bring the same
              passion and dedication to every dish we serve.
            </p>

            <h2 className="text-3xl font-bold mb-4 text-gray-900">Why Francesco's is the Best Pizza in Murrells Inlet</h2>
            <ul className="list-disc list-inside mb-6 text-gray-700 space-y-2">
              <li>Over 40 years of Sicilian family heritage</li>
              <li>Fresh, high-quality ingredients sourced daily</li>
              <li>Hand-tossed dough made fresh every day</li>
              <li>Traditional Italian cooking methods</li>
              <li>Family recipes passed down by Nonna</li>
              <li>Convenient online ordering for pickup</li>
              <li>Catering available for events and parties</li>
              <li>Rewards program for loyal customers</li>
            </ul>

            <h2 className="text-3xl font-bold mb-4 text-gray-900">Order the Best Pizza in Murrells Inlet Today</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Ready to taste why we're known as the <strong>best pizza in Murrells Inlet</strong>? Order online now for
              fast pickup. Whether you're craving a classic cheese pizza, loaded specialty pie, hearty calzone,
              or delicious pasta, Francesco's has something for everyone.
              Join our rewards program and earn points with every order.
              Experience the authentic taste of NY style pizza right here in Murrells Inlet, SC!
            </p>
          </div>

          {/* Location & Service Area Keywords */}
          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Serving Murrells Inlet & Surrounding Areas</h3>
            <p className="text-gray-700 mb-3">
              <strong>Murrells Inlet Pizza:</strong> We proudly serve customers from across the Grand Strand area
              including Murrells Inlet, Surfside Beach, Garden City, Murrells Inlet, and surrounding communities in South Carolina.
            </p>
            <p className="text-gray-700">
              <strong>Our Location:</strong> Visit us at 2539 US-17S, #6, Murrells Inlet, SC 29576.
              Order online for pickup and enjoy the best NY style pizza in town!
            </p>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeoContentSection;
