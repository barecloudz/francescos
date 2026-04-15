"use client";

import Link from "next/link";
import { Facebook, Instagram, Phone, MapPin, Mail, Clock } from "lucide-react";
import { useBranding } from "@/hooks/use-branding";
import { useRestaurantSettings } from "@/hooks/use-restaurant-settings";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const { companyName, companyTagline, logoUrl } = useBranding();
  const { address, phone, email } = useRestaurantSettings();
  const [showNeighborhoodModal, setShowNeighborhoodModal] = useState(false);

  // Murrells Inlet area neighborhoods - can be expanded later
  const neighborhoods: { name: string; slug: string }[] = [];
  
  return (
    <footer
      className="pt-16 pb-8"
      style={{
        background: '#0a0a0a',
        borderTop: '1px solid rgba(192,57,43,0.25)',
      }}
    >
      <div className="container mx-auto px-4">
        {/* Our Story Section */}
        <div id="story" className="mb-16 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="section-eyebrow mb-0">Our Heritage</p>
            <div className="section-divider"></div>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#f5f0e8] mb-8">Our Story</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <p className="text-base text-[#e8e3dc] mb-6 leading-relaxed font-light">
                  Welcome to Francesco's Pizza Kitchen, where authentic Italian tradition meets the heart of Murrells Inlet.
                  We've poured our passion into every dish we craft, using time-honored recipes,
                  fresh ingredients, and a whole lot of love.
                </p>
                <p className="text-base text-[#e8e3dc] mb-6 leading-relaxed font-light">
                  Come taste the difference at Francesco's, where every bite feels like home.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <p className="section-eyebrow">Fresh Ingredients Daily</p>
                  <div className="hidden sm:block w-px bg-[rgba(192,57,43,0.3)] mx-2"></div>
                  <p className="section-eyebrow">Authentic Italian</p>
                </div>
              </div>
              <div>
                <img
                  src="/images/lineup.jpg"
                  alt="Francesco's Pizza Kitchen Team"
                  className="shadow-xl shadow-black/50 w-full h-64 object-cover"
                  style={{ border: '1px solid rgba(192,57,43,0.2)' }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 - About */}
          <div className="text-center md:text-left">
            <div className="mb-6 flex justify-center md:justify-start">
              <img src={logoUrl} alt={companyName} className="w-[150px] opacity-90" />
            </div>
            <p className="mb-6 text-[#b8b3ab] text-sm leading-relaxed font-light">
              {companyTagline}
            </p>
            <div className="flex space-x-3 justify-center md:justify-start">
              <a
                href="https://www.facebook.com/profile.php?id=61580096004134"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center border border-[rgba(192,57,43,0.3)] text-[#b8b3ab] hover:text-[#c0392b] hover:border-[#c0392b] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://www.instagram.com/francescosmurrellsinlet/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center border border-[rgba(192,57,43,0.3)] text-[#b8b3ab] hover:text-[#c0392b] hover:border-[#c0392b] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="text-center md:text-left">
            <h3
              className="mb-6 text-[#f5f0e8] font-playfair"
              style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}
            >
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/menu', label: 'Menu' },
                { href: '#story', label: 'About Us', isAnchor: true },
                { href: '/#locations', label: 'Location' },
                { href: '/auth', label: 'Login / Register' },
                { href: '/community-impact', label: 'Community Impact' },
              ].map(({ href, label, isAnchor }) => (
                <li key={href}>
                  {isAnchor ? (
                    <a href={href} className="text-[#b8b3ab] hover:text-[#c0392b] transition-colors text-sm font-light">
                      {label}
                    </a>
                  ) : (
                    <Link href={href}>
                      <div className="text-[#b8b3ab] hover:text-[#c0392b] transition-colors cursor-pointer text-sm font-light">{label}</div>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div className="text-center md:text-left">
            <h3
              className="mb-6 text-[#f5f0e8] font-playfair"
              style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}
            >
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start justify-center md:justify-start">
                <MapPin className="mt-0.5 mr-3 h-4 w-4 text-[#c0392b] flex-shrink-0" />
                <span className="text-[#b8b3ab] text-sm font-light">{address}</span>
              </li>
              <li className="flex items-start justify-center md:justify-start">
                <Phone className="mt-0.5 mr-3 h-4 w-4 text-[#c0392b] flex-shrink-0" />
                <a
                  href={`tel:${phone.replace(/[^\d]/g, '')}`}
                  className="text-[#b8b3ab] hover:text-[#c0392b] transition-colors text-sm font-light"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-start justify-center md:justify-start">
                <Mail className="mt-0.5 mr-3 h-4 w-4 text-[#c0392b] flex-shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="text-[#b8b3ab] hover:text-[#c0392b] transition-colors text-sm font-light"
                >
                  {email}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Hours */}
          <div className="text-center md:text-left">
            <h3
              className="mb-6 text-[#f5f0e8] font-playfair"
              style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}
            >
              Open Hours
            </h3>
            <ul className="space-y-4">
              <li className="text-[#b8b3ab]">
                <span className="flex items-center mb-1 justify-center md:justify-start">
                  <Clock className="mr-2 h-4 w-4 text-[#c0392b] flex-shrink-0" />
                  <span className="text-sm text-[#e8e3dc]">Every Day</span>
                </span>
                <span className="block pl-0 md:pl-6 text-sm font-light">11:00 AM &ndash; 9:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(192,57,43,0.15)' }}>
          <div className="text-center mb-6">
            <p className="section-eyebrow mb-2">Visit Us</p>
            <p className="text-[#b8b3ab] text-xs font-light tracking-widest uppercase">Best Pizza in Murrells Inlet, SC</p>
          </div>
          <div className="overflow-hidden shadow-lg shadow-black/50 max-w-4xl mx-auto" style={{ border: '1px solid rgba(192,57,43,0.2)' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.0!2d-79.0481!3d33.5479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s2520%20US-17%20BUS%2C%20Murrells%20Inlet%2C%20SC%2029576!5e0!3m2!1sen!2sus!4v1703097600000!5m2!1sen!2sus"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Francesco's Pizza Kitchen Location - Best Pizza in Murrells Inlet"
            />
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(192,57,43,0.15)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left mb-4">
            <p
              className="text-[#999999]"
              style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}
            >
              &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link href="/privacy">
                <div
                  className="text-[#999999] hover:text-[#c0392b] transition-colors cursor-pointer"
                  style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                  Privacy Policy
                </div>
              </Link>
              <Link href="/terms">
                <div
                  className="text-[#999999] hover:text-[#c0392b] transition-colors cursor-pointer"
                  style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                  Terms &amp; Conditions
                </div>
              </Link>
            </div>
          </div>

          {/* Developer Credit */}
          <div className="text-center pt-4" style={{ borderTop: '1px solid rgba(192,57,43,0.1)' }}>
            <p className="text-[#444444]" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
              Developed by{" "}
              <a
                href="https://nardonidigital.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#999999] hover:text-[#c0392b] transition-colors"
              >
                Nardoni Digital
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Neighborhood Modal */}
      <Dialog open={showNeighborhoodModal} onOpenChange={setShowNeighborhoodModal}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#d73a31]">
              Welcome to the neighborhood - pick your area
            </DialogTitle>
            <DialogDescription className="text-lg pt-2">
              We deliver authentic NY-style pizza to neighborhoods across Asheville!
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4">
            {neighborhoods.map((neighborhood) => (
              <Link key={neighborhood.slug} href={`/${neighborhood.slug}`}>
                <Button
                  onClick={() => setShowNeighborhoodModal(false)}
                  variant="outline"
                  className="w-full h-auto py-4 px-4 text-left border-2 border-gray-200 hover:border-[#d73a31] hover:bg-[#f9f5f0] transition-all"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#d73a31] flex-shrink-0" />
                    <span className="font-semibold text-gray-900">{neighborhood.name}</span>
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;
