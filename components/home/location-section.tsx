import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock } from "lucide-react";

const LocationSection: React.FC = () => {
  return (
    <section
      id="location"
      className="py-32 md:py-40"
      style={{
        background: '#f2ede8',
        borderTop: '1px solid #e5e0d8',
        borderBottom: '1px solid #e5e0d8',
      }}
    >
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="section-eyebrow">Find Us</p>
          <div className="section-divider"></div>
          <h2 className="font-playfair text-5xl md:text-7xl font-bold text-[#111111]">Visit Us</h2>
        </div>

        <div
          className="overflow-hidden"
          style={{ border: '1px solid #e5e0d8' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Map */}
            <div className="h-[400px] md:h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.0!2d-79.0481!3d33.5479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s2520%20US-17%20BUS%2C%20Murrells%20Inlet%2C%20SC%2029576!5e0!3m2!1sen!2sus!4v1635555555555!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                title="Francesco's Pizza Kitchen Murrells Inlet Location"
              ></iframe>
            </div>

            {/* Location details */}
            <div className="p-12 md:p-16" style={{ background: '#ffffff' }}>
              <p className="section-eyebrow mb-3">Our Location</p>
              <h3 className="font-playfair text-3xl md:text-4xl font-bold text-[#111111] mb-8">
                Francesco's Pizza Kitchen
              </h3>

              <div className="space-y-7">
                {/* Address */}
                <div
                  className="pl-4"
                  style={{ borderLeft: '2px solid #c0392b' }}
                >
                  <p
                    className="section-eyebrow mb-1"
                    style={{ fontSize: '0.65rem' }}
                  >
                    Address
                  </p>
                  <div className="flex items-start mt-1">
                    <MapPin className="w-4 h-4 text-[#c0392b] mr-3 mt-0.5 flex-shrink-0" />
                    <address className="not-italic text-[#111111] text-sm font-light leading-relaxed">
                      <p>2520 US-17 BUS</p>
                      <p>Murrells Inlet, SC 29576</p>
                    </address>
                  </div>
                </div>

                {/* Phone */}
                <div
                  className="pl-4"
                  style={{ borderLeft: '2px solid #c0392b' }}
                >
                  <p
                    className="section-eyebrow mb-1"
                    style={{ fontSize: '0.65rem' }}
                  >
                    Phone
                  </p>
                  <div className="flex items-start mt-1">
                    <Phone className="w-4 h-4 text-[#c0392b] mr-3 mt-0.5 flex-shrink-0" />
                    <a
                      href="tel:+18432992700"
                      className="text-[#111111] hover:text-[#c0392b] transition-colors text-sm font-light"
                    >
                      (843) 299-2700
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div
                  className="pl-4"
                  style={{ borderLeft: '2px solid #c0392b' }}
                >
                  <p
                    className="section-eyebrow mb-1"
                    style={{ fontSize: '0.65rem' }}
                  >
                    Hours
                  </p>
                  <div className="flex items-start mt-1">
                    <Clock className="w-4 h-4 text-[#c0392b] mr-3 mt-0.5 flex-shrink-0" />
                    <ul className="space-y-1 text-[#111111] text-sm font-light">
                      <li>Every Day: 11:00 AM &ndash; 9:00 PM</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Link href="/menu">
                  <button
                    className="w-full py-4 text-xs font-bold tracking-widest uppercase text-[#f5f0e8] transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #7a1a14, #c0392b, #e74c3c, #c0392b, #7a1a14)' }}
                  >
                    Order Online
                  </button>
                </Link>
              </div>

              <div className="mt-6 text-center">
                <a
                  href="https://maps.google.com/?q=2520+US-17+BUS,+Murrells+Inlet,+SC+29576"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c0392b] text-xs font-bold tracking-widest uppercase hover:text-[#e74c3c] transition-colors"
                  style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}
                >
                  Get Directions &rarr;
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
