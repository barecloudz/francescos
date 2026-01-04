import { Link } from "wouter";
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

  // Myrtle Beach area neighborhoods - can be expanded later
  const neighborhoods: { name: string; slug: string }[] = [];
  
  return (
    <footer className="bg-[#222] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Our Story Section */}
        <div id="story" className="mb-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#f2c94c] mb-8">OUR STORY</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  Welcome to Genova's Pizza & Pasta, where authentic Italian tradition meets the heart of Myrtle Beach.
                  We've poured our passion into every dish we craft—using time-honored recipes,
                  fresh ingredients, and a whole lot of love.
                </p>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  Come taste the difference at Genova's—where every bite feels like home.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <p className="text-lg font-bold text-[#d73a31]">
                    Fresh Ingredients Daily
                  </p>
                  <div className="hidden sm:block w-0.5 bg-gray-600 mx-2"></div>
                  <p className="text-lg font-bold text-[#d73a31]">
                    Authentic Italian
                  </p>
                </div>
              </div>
              <div>
                <img
                  src="/images/lineup.jpg"
                  alt="Genova's Pizza & Pasta Team"
                  className="rounded-xl shadow-xl w-full h-64 object-cover"
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
              <img src={logoUrl} alt={companyName} className="w-[150px]" />
            </div>
            <p className="mb-6 text-gray-300">
              {companyTagline}
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a
                href="https://www.facebook.com/profile.php?id=61580096004134"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#d73a31] hover:bg-[#f2c94c] text-white p-2 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/genovasmyrtlebeach/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#d73a31] hover:bg-[#f2c94c] text-white p-2 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2 - Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-6 text-[#f2c94c]">QUICK LINKS</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/">
                  <div className="text-gray-300 hover:text-white hover:underline transition-colors cursor-pointer">Home</div>
                </Link>
              </li>
              <li>
                <Link href="/menu">
                  <div className="text-gray-300 hover:text-white hover:underline transition-colors cursor-pointer">Menu</div>
                </Link>
              </li>
              <li>
                <a href="#story" className="text-gray-300 hover:text-white hover:underline transition-colors cursor-pointer">
                  About Us
                </a>
              </li>
              <li>
                <Link href="/#locations">
                  <div className="text-gray-300 hover:text-white hover:underline transition-colors cursor-pointer">Location</div>
                </Link>
              </li>
              <li>
                <Link href="/auth">
                  <div className="text-gray-300 hover:text-white hover:underline transition-colors cursor-pointer">Login / Register</div>
                </Link>
              </li>
              <li>
                <Link href="/community-impact">
                  <div className="text-gray-300 hover:text-white hover:underline transition-colors cursor-pointer">Community Impact</div>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3 - Contact */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-6 text-[#f2c94c]">CONTACT US</h3>
            <ul className="space-y-4">
              <li className="flex items-start justify-center md:justify-start">
                <MapPin className="mt-1 mr-3 h-5 w-5 text-[#d73a31] flex-shrink-0" />
                <span className="text-gray-300">{address}</span>
              </li>
              <li className="flex items-start justify-center md:justify-start">
                <Phone className="mt-1 mr-3 h-5 w-5 text-[#d73a31] flex-shrink-0" />
                <a
                  href={`tel:${phone.replace(/[^\d]/g, '')}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-start justify-center md:justify-start">
                <Mail className="mt-1 mr-3 h-5 w-5 text-[#d73a31] flex-shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {email}
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 4 - Hours */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-6 text-[#f2c94c]">OPEN HOURS</h3>
            <ul className="space-y-4">
              <li className="text-gray-300">
                <span className="flex items-center mb-1 justify-center md:justify-start">
                  <Clock className="mr-2 h-5 w-5 text-[#d73a31] flex-shrink-0" />
                  <span className="font-semibold">Every Day</span>
                </span>
                <span className="block pl-0 md:pl-7">11:00 AM - 9:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-[#f2c94c] mb-2">FIND US</h3>
            <p className="text-gray-400 text-sm">Best Pizza & Pasta in Myrtle Beach, SC</p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg max-w-4xl mx-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.0!2d-78.8843!3d33.7093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s4620%20Dick%20Pond%20Rd%2C%20Myrtle%20Beach%2C%20SC%2029588!5e0!3m2!1sen!2sus!4v1703097600000!5m2!1sen!2sus"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Genova's Pizza & Pasta Location - Best Pizza in Myrtle Beach"
            />
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left mb-4">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</p>
            <div className="mt-4 md:mt-0 space-x-6">
              <Link href="/privacy">
                <div className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Privacy Policy</div>
              </Link>
              <Link href="/terms">
                <div className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Terms & Conditions</div>
              </Link>
            </div>
          </div>

          {/* Developer Credit */}
          <div className="text-center pt-4 border-t border-gray-800">
            <p className="text-sm text-gray-500">
              Developed by{" "}
              <a
                href="https://nardonidigital.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors underline"
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
              Welcome to the neighborhood — pick your area
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
