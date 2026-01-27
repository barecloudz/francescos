import React from "react";
import { Check } from "lucide-react";

const WhyFrancescosSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-[#d73a31]">
              Why Francesco's is Myrtle Beach's Best Pizza
            </h2>
            <p className="text-xl text-gray-700">
              Over 40 Years of Sicilian Heritage & Family Tradition
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">Family Devotion</h3>
                  <p className="text-gray-600">Born from a family's devotion to one another. Every slice is a story, every bite a reminder that family is the greatest ingredient!</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">Sicilian Heritage Since 1980s</h3>
                  <p className="text-gray-600">Over 40 years carrying forward authentic Sicilian flavors. Family traditions & recipes passed down by our Nonna.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">Fresh Dough Made Daily</h3>
                  <p className="text-gray-600">Never frozen. We make our dough fresh every single day using traditional methods.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">Hand-Tossed NY Style Pizza</h3>
                  <p className="text-gray-600">Authentic New York style pizza made the traditional way, hand-tossed and baked to perfection.</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">A Gathering Place</h3>
                  <p className="text-gray-600">Each Francesco's table is a gathering place where strangers become friends & friends become family!</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">From NY to Myrtle Beach</h3>
                  <p className="text-gray-600">From the bustling streets of New York to South Carolina, bringing authentic flavors to our new community.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">Catering for Events & Parties</h3>
                  <p className="text-gray-600">Planning an event? We offer catering services with the same quality you love.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">Rewards Program for Loyal Customers</h3>
                  <p className="text-gray-600">Earn points with every order and get rewarded for being part of the Francesco's family!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <div className="bg-[#d73a31] text-white py-8 px-6 rounded-lg shadow-xl">
              <h3 className="text-3xl font-bold mb-4">Welcome to Our Family!</h3>
              <p className="text-lg mb-6">Experience the warmth of our Sicilian heritage. Order online for pickup today!</p>
              <a href="/menu" className="inline-block bg-white text-[#d73a31] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                Order Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyFrancescosSection;
