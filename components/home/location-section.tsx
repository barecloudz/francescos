import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock } from "lucide-react";

const LocationSection: React.FC = () => {
  return (
    <section id="location" className="py-16 bg-[#f9f5f0]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-[#d73a31]">VISIT US</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Experience our authentic Italian cuisine at our Murrells Inlet location on US-17!
            We're open 7 days a week to serve you the best NY style pizza and pasta in town!
          </p>
        </div>

        <div className="bg-white rounded-xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Map Section */}
            <div className="h-[400px] md:h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.0!2d-79.0481!3d33.5479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s2539%20US-17%20S%20%236%2C%20Murrells%20Inlet%2C%20SC%2029576!5e0!3m2!1sen!2sus!4v1635555555555!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                title="Francesco's Pizza & Pasta Murrells Inlet Location"
              ></iframe>
            </div>

            {/* Location Details */}
            <div className="p-8 md:p-12">
              <div className="bg-[#f9f5f0] p-8 rounded-xl">
                <h3 className="text-3xl font-bold text-[#d73a31] mb-8">FRANCESCO'S PIZZA & PASTA</h3>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 text-[#d73a31] mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-xl font-bold mb-2">Address</h4>
                      <address className="not-italic text-gray-700">
                        <p>2539 US-17S, #6</p>
                        <p>Murrells Inlet, SC 29576</p>
                      </address>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-6 h-6 text-[#d73a31] mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-xl font-bold mb-2">Phone</h4>
                      <p>
                        <a href="tel:+18432992700" className="text-gray-700 hover:text-[#d73a31] transition-colors">
                          (843) 299-2700
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="w-6 h-6 text-[#d73a31] mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-xl font-bold mb-2">Hours</h4>
                      <ul className="space-y-1 text-gray-700">
                        <li>Every Day: 11:00 AM - 9:00 PM</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link href="/menu">
                    <Button className="w-full bg-[#d73a31] hover:bg-[#c73128] text-white py-4 text-lg font-bold rounded-full">
                      ORDER ONLINE
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="mt-8 text-center">
                <a
                  href="https://maps.google.com/?q=2539+US-17+S+%236,+Murrells+Inlet,+SC+29576"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#d73a31] font-bold text-lg hover:underline"
                >
                  Get Directions →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
