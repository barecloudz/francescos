"use client";

import { useState, useEffect } from "react";
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-supabase-auth";
import { useCart } from "@/hooks/use-cart";
import { useBranding } from "@/hooks/use-branding";
import {
  Home,
  Menu as MenuIcon,
  ShoppingBag,
  User,
  MapPin,
  Phone,
  X,
  LogOut,
  ChefHat,
  BarChart3,
  Star,
  Clock,
  UtensilsCrossed,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChristmasCountdownButton } from "@/components/christmas/christmas-countdown-button";
import { AdventCalendarModal } from "@/components/christmas/advent-calendar-modal";

const Header = () => {
  const location = usePathname();
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const { user, signOut } = useAuth();
  const { items, toggleCart } = useCart();
  const { companyName, logoUrl } = useBranding();

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProfileMenuOpen, setMobileProfileMenuOpen] = useState(false);
  const [adventCalendarOpen, setAdventCalendarOpen] = useState(false);
  const [cateringButtonEnabled, setCateringButtonEnabled] = useState(true);

  // Fetch catering button visibility setting
  useEffect(() => {
    const fetchCateringSetting = async () => {
      try {
        const response = await fetch('/api/catering-settings');
        if (response.ok) {
          const data = await response.json();
          setCateringButtonEnabled(data.catering_button_enabled !== false);
        }
      } catch (error) {
        console.error('Failed to fetch catering settings:', error);
        // Default to enabled on error
        setCateringButtonEnabled(true);
      }
    };
    fetchCateringSetting();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setMobileMenuOpen(false);
      setMobileProfileMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavigate = (path: string) => {
    setMobileProfileMenuOpen(false);
    navigate(path);
  };

  // Don't show header on auth pages
  if (location.startsWith("/auth")) {
    return null;
  }

  // Show full header for all pages except standalone pages (admin, kitchen display)
  // This includes home, menu, neighborhood pages, etc.
  const standalonePages = ["/kitchen", "/admin/dashboard", "/admin/faqs", "/admin/fix-points"];
  const isStandalonePage = standalonePages.some(page => location.startsWith(page));

  if (!isStandalonePage) {
    return (
      <>
        {/* Desktop Header — 3 stacked rows like LTD */}
        <header className="fixed w-full top-0 z-50 hidden lg:block" style={{
          background: '#f5f2ec',
          paddingTop: 'env(safe-area-inset-top, 0px)',
          top: 'env(safe-area-inset-top, 0px)'
        }}>
          {/* Row 1: Announcement bar */}
          <div className="w-full text-center py-2 px-4 text-xs tracking-widest uppercase" style={{ background: '#1a1a1a', color: '#f5f0e8', letterSpacing: '0.18em' }}>
            <span>Coming Very Soon to Murrells Inlet</span>
            <Link href="/menu" className="ml-4 inline-block border border-[#f5f0e8]/50 px-3 py-0.5 text-[0.6rem] tracking-widest hover:bg-[#f5f0e8] hover:text-[#1a1a1a] transition-colors font-bold">
              Order Now
            </Link>
          </div>
          {/* Row 2: Logo centered */}
          <div className="flex justify-center py-4 border-b border-[#e0dbd0]">
            <Link href="/">
              <img src={logoUrl} alt={companyName} className="h-16" />
            </Link>
          </div>
          {/* Row 3: Nav links full-width + social icons */}
          <div className="flex items-center justify-between px-10 py-3 border-b border-[#e0dbd0]">
            <nav className="flex items-center space-x-8">
              <Link href="/menu">
                <span className={`text-xs font-bold tracking-[0.18em] uppercase transition-colors ${location === "/menu" ? "text-[#c0392b]" : "text-[#1a1a1a] hover:text-[#c0392b]"}`}>Menu</span>
              </Link>
              <Link href="/menu">
                <span className={`text-xs font-bold tracking-[0.18em] uppercase transition-colors text-[#1a1a1a] hover:text-[#c0392b]`}>Order</span>
              </Link>
              <button
                onClick={() => {
                  if (location === "/") {
                    document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.location.href = '/#location';
                  }
                }}
                className="text-xs font-bold tracking-[0.18em] uppercase transition-colors text-[#1a1a1a] hover:text-[#c0392b]"
              >
                Visit Us
              </button>
              <Link href="/catering">
                <span className={`text-xs font-bold tracking-[0.18em] uppercase transition-colors ${location === "/catering" ? "text-[#c0392b]" : "text-[#1a1a1a] hover:text-[#c0392b]"}`}>Catering</span>
              </Link>
              <Link href="/community-impact">
                <span className={`text-xs font-bold tracking-[0.18em] uppercase transition-colors ${location === "/community-impact" ? "text-[#c0392b]" : "text-[#1a1a1a] hover:text-[#c0392b]"}`}>Community</span>
              </Link>
            </nav>
            {/* Social icons + user */}
            <div className="flex items-center space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#1a1a1a] hover:text-[#c0392b] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#1a1a1a] hover:text-[#c0392b] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hover:bg-[#e8e3d8] text-[#1a1a1a] h-8 px-2">
                      <Avatar className="h-6 w-6 mr-1.5">
                        <AvatarFallback className="text-xs bg-[#c0392b] text-white">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-bold tracking-widest uppercase">{user.firstName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-1 bg-white border border-[#e0dbd0] shadow-lg rounded-none">
                    <DropdownMenuItem onClick={() => navigate("/profile")} className="text-xs font-bold tracking-widest uppercase cursor-pointer hover:bg-[#f5f2ec] rounded-none">
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/community-impact")} className="text-xs font-bold tracking-widest uppercase cursor-pointer hover:bg-[#f5f2ec] rounded-none">
                      Community
                    </DropdownMenuItem>
                    {(user.role === "employee" || user.isAdmin) && (
                      <DropdownMenuItem onClick={() => navigate("/employee/clock")} className="text-xs font-bold tracking-widest uppercase cursor-pointer hover:bg-[#f5f2ec] rounded-none">
                        Clock In/Out
                      </DropdownMenuItem>
                    )}
                    {user.isAdmin && (
                      <DropdownMenuItem onClick={() => navigate("/admin/dashboard")} className="text-xs font-bold tracking-widest uppercase cursor-pointer hover:bg-[#f5f2ec] rounded-none">
                        Admin
                      </DropdownMenuItem>
                    )}
                    {(user.isAdmin || user.role === "employee" || user.role === "kitchen" || user.role === "manager") && (
                      <DropdownMenuItem onClick={() => navigate("/kitchen")} className="text-xs font-bold tracking-widest uppercase cursor-pointer hover:bg-[#f5f2ec] rounded-none">
                        Kitchen Display
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-xs font-bold tracking-widest uppercase cursor-pointer text-[#c0392b] hover:bg-[#f5f2ec] rounded-none">
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
          </div>
        </header>

        {/* Mobile Top Header — logo left, icons + hamburger right */}
        <header className="fixed top-0 left-0 right-0 z-40 lg:hidden" style={{
          background: '#f5f2ec',
          paddingTop: 'env(safe-area-inset-top, 0px)',
          top: 'env(safe-area-inset-top, 0px)'
        }}>
          {/* Announcement Bar */}
          <div className="w-full text-center py-1.5 px-4 text-[0.6rem] tracking-widest uppercase" style={{ background: '#1a1a1a', color: '#f5f0e8' }}>
            Coming Very Soon to Murrells Inlet
          </div>
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#e0dbd0]">
            {/* Logo left */}
            <Link href="/">
              <img src={logoUrl} alt={companyName} className="h-10" />
            </Link>
            {/* Right: social icons + user avatar + hamburger */}
            <div className="flex items-center space-x-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#1a1a1a]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#1a1a1a]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              {user ? (
                <Button variant="ghost" size="sm" onClick={() => setMobileProfileMenuOpen(true)} className="text-[#1a1a1a] hover:bg-[#e8e3d8] p-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-[#c0392b] text-white">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              ) : (
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[#1a1a1a] p-1">
                  <MenuIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          {/* Mobile dropdown menu (when hamburger clicked) */}
          {mobileMenuOpen && (
            <div className="bg-[#f5f2ec] border-b border-[#e0dbd0] py-4 px-6 space-y-4">
              <Link href="/menu" onClick={() => setMobileMenuOpen(false)}>
                <div className="text-xs font-bold tracking-[0.18em] uppercase text-[#1a1a1a] py-2 border-b border-[#e0dbd0]">Menu</div>
              </Link>
              <Link href="/menu" onClick={() => setMobileMenuOpen(false)}>
                <div className="text-xs font-bold tracking-[0.18em] uppercase text-[#1a1a1a] py-2 border-b border-[#e0dbd0]">Order</div>
              </Link>
              <Link href="/catering" onClick={() => setMobileMenuOpen(false)}>
                <div className="text-xs font-bold tracking-[0.18em] uppercase text-[#1a1a1a] py-2 border-b border-[#e0dbd0]">Catering</div>
              </Link>
              <Link href="/community-impact" onClick={() => setMobileMenuOpen(false)}>
                <div className="text-xs font-bold tracking-[0.18em] uppercase text-[#1a1a1a] py-2">Community</div>
              </Link>
            </div>
          )}
        </header>

        {/* Mobile Bottom Navigation — minimal like LTD */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] border-t border-[#333] lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div className="flex justify-around items-center h-14 px-2">
            <Link href="/menu">
              <span className={`text-xs font-bold tracking-[0.18em] uppercase transition-colors ${location === "/menu" ? "text-[#c0392b]" : "text-[#f5f0e8] hover:text-[#c0392b]"}`}>Order</span>
            </Link>
            {cateringButtonEnabled && (
              <Link href="/catering">
                <span className={`text-xs font-bold tracking-[0.18em] uppercase transition-colors ${location === "/catering" ? "text-[#c0392b]" : "text-[#f5f0e8] hover:text-[#c0392b]"}`}>Catering</span>
              </Link>
            )}
            <Link href="/community-impact">
              <span className={`text-xs font-bold tracking-[0.18em] uppercase transition-colors ${location === "/community-impact" ? "text-[#c0392b]" : "text-[#f5f0e8] hover:text-[#c0392b]"}`}>Community</span>
            </Link>
            {user && (
              <span
                className={`text-xs font-bold tracking-[0.18em] uppercase cursor-pointer transition-colors ${location === "/profile" ? "text-[#c0392b]" : "text-[#f5f0e8] hover:text-[#c0392b]"}`}
                onClick={() => setMobileProfileMenuOpen(true)}
              >
                Profile
              </span>
            )}
          </div>
        </nav>

        {/* Advent Calendar Modal */}
        <AdventCalendarModal
          open={adventCalendarOpen}
          onClose={() => setAdventCalendarOpen(false)}
        />

        {/* Full-Screen Mobile Profile Menu Overlay */}
        {mobileProfileMenuOpen && (
          <div
            className="fixed inset-0 z-[100] bg-[#0a0a0a] lg:hidden animate-in slide-in-from-right duration-300"
            style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
          >
            {/* Header with Close Button */}
            <div className="flex items-center justify-between p-6 border-b border-[rgba(192,57,43,0.2)]">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-lg bg-[#c0392b] text-white font-playfair">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-playfair font-semibold text-lg text-[#f5f0e8]">{user?.firstName} {user?.lastName}</h2>
                  <p className="text-sm text-[#888888]">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setMobileProfileMenuOpen(false)}
                className="flex items-center justify-center w-10 h-10 bg-[#111111] border border-[rgba(192,57,43,0.2)] hover:border-[rgba(192,57,43,0.5)] transition-colors"
              >
                <X className="h-5 w-5 text-[#cccccc]" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col p-4 space-y-2">
              <button
                onClick={() => handleNavigate("/profile")}
                className="flex items-center space-x-4 p-4 bg-[#111111] border border-[rgba(192,57,43,0.15)] hover:border-[rgba(192,57,43,0.4)] active:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-[#0a0a0a]">
                  <User className="h-5 w-5 text-[#c0392b]" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-[#f5f0e8]">My Profile</h3>
                  <p className="text-sm text-[#888888]">View and edit your profile</p>
                </div>
              </button>

              <button
                onClick={() => handleNavigate("/community-impact")}
                className="flex items-center space-x-4 p-4 bg-[#111111] border border-[rgba(192,57,43,0.15)] hover:border-[rgba(192,57,43,0.4)] active:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-[#0a0a0a]">
                  <HeartHandshake className="h-5 w-5 text-[#c0392b]" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-[#f5f0e8]">Community Impact</h3>
                  <p className="text-sm text-[#888888]">Support local organizations</p>
                </div>
              </button>

              <button
                onClick={() => handleNavigate("/catering")}
                className="flex items-center space-x-4 p-4 bg-[#111111] border border-[rgba(192,57,43,0.15)] hover:border-[rgba(192,57,43,0.4)] active:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-[#0a0a0a]">
                  <UtensilsCrossed className="h-5 w-5 text-[#c0392b]" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-[#f5f0e8]">Catering</h3>
                  <p className="text-sm text-[#888888]">Order catering for your event</p>
                </div>
              </button>

              {(user?.role === "employee" || user?.isAdmin) && (
                <button
                  onClick={() => handleNavigate("/employee/clock")}
                  className="flex items-center space-x-4 p-4 bg-[#111111] border border-[rgba(192,57,43,0.15)] hover:border-[rgba(192,57,43,0.4)] active:bg-[#1a1a1a] transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-[#0a0a0a]">
                    <Clock className="h-5 w-5 text-[#c0392b]" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-[#f5f0e8]">Clock In/Out</h3>
                    <p className="text-sm text-[#888888]">Manage your time</p>
                  </div>
                </button>
              )}

              {user?.isAdmin && (
                <>
                  <div className="h-px bg-[rgba(192,57,43,0.2)] my-1"></div>
                  <button
                    onClick={() => handleNavigate("/admin/dashboard")}
                    className="flex items-center space-x-4 p-4 bg-[#111111] border border-[rgba(192,57,43,0.15)] hover:border-[rgba(192,57,43,0.4)] active:bg-[#1a1a1a] transition-colors"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-[#0a0a0a]">
                      <BarChart3 className="h-5 w-5 text-[#c0392b]" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-medium text-[#f5f0e8]">Admin Dashboard</h3>
                      <p className="text-sm text-[#888888]">Manage your restaurant</p>
                    </div>
                  </button>
                </>
              )}

              {(user?.isAdmin || user?.role === "employee" || user?.role === "kitchen" || user?.role === "manager") && (
                <button
                  onClick={() => handleNavigate("/kitchen")}
                  className="flex items-center space-x-4 p-4 bg-[#111111] border border-[rgba(192,57,43,0.15)] hover:border-[rgba(192,57,43,0.4)] active:bg-[#1a1a1a] transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-[#0a0a0a]">
                    <ChefHat className="h-5 w-5 text-[#c0392b]" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-[#f5f0e8]">Kitchen Display</h3>
                    <p className="text-sm text-[#888888]">View orders in kitchen</p>
                  </div>
                </button>
              )}

              <div className="h-px bg-[rgba(192,57,43,0.2)] my-1"></div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-4 p-4 bg-[#111111] border border-[rgba(192,57,43,0.15)] hover:border-[rgba(192,57,43,0.5)] active:bg-[#200808] transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-[#0a0a0a]">
                  <LogOut className="h-5 w-5 text-[#c0392b]" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-[#c0392b]">Log Out</h3>
                  <p className="text-sm text-[#888888]">Sign out of your account</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Add bottom padding to main content for mobile */}
        <div className="pb-16 lg:pb-0"></div>
      </>
    );
  }

  // Fallback header for other pages
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{companyName}</h1>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback className="text-xs">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                {user.firstName}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-3 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 shadow-2xl">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-5 py-4 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-red-100 hover:to-red-200 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm">
                  <LogOut className="h-5 w-5 text-red-600" />
                </div>
                <span className="font-semibold text-red-600 text-base">Log Out</span>
              </button>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
