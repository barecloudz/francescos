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
        {/* Desktop Header */}
        <header className={`fixed w-full top-0 z-50 transition-all duration-300 hidden lg:block ${
          isScrolled ? "bg-[#0a0a0a] shadow-lg shadow-black/50" : "bg-[#0a0a0a]/95 backdrop-blur-sm"
        } border-b border-[rgba(192,57,43,0.2)]`} style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          top: 'env(safe-area-inset-top, 0px)'
        }}>
          {/* Announcement Bar */}
          <div className="w-full text-center py-2 px-4 text-xs tracking-widest uppercase" style={{ background: '#c0392b', color: '#fff', letterSpacing: '0.2em' }}>
            <span>Now Open in Murrells Inlet</span>
            <Link href="/menu" className="ml-4 inline-block border border-white/60 px-3 py-0.5 text-[0.6rem] tracking-widest hover:bg-white hover:text-[#c0392b] transition-colors font-bold">
              Order Now
            </Link>
          </div>
          {/* Main navigation */}
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/">
                <div className="flex items-center space-x-4">
                  <img src={logoUrl} alt={companyName} className="h-12" />
                  <div className="hidden lg:block">
                    <h1 className="font-playfair text-sm font-normal text-[#f5f0e8] uppercase" style={{letterSpacing:'0.2em'}}>{companyName}</h1>
                  </div>
                </div>
              </Link>

              {/* Navigation Links */}
              <nav className="hidden lg:flex items-center space-x-8">
                <Link href="/">
                  <div className={`text-base tracking-wide transition-colors ${
                    location === "/" ? "text-[#c0392b]" : "text-[#cccccc] hover:text-[#f5f0e8]"
                  }`}>
                    Home
                  </div>
                </Link>
                <Link href="/menu">
                  <div className={`text-base tracking-wide transition-colors ${
                    location === "/menu" ? "text-[#c0392b]" : "text-[#cccccc] hover:text-[#f5f0e8]"
                  }`}>
                    Menu
                  </div>
                </Link>
                <button
                  onClick={() => {
                    if (location === "/") {
                      // If already on home page, scroll to location section
                      const locationSection = document.getElementById('location');
                      if (locationSection) {
                        locationSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    } else {
                      // If on a different page, navigate to home page with hash
                      window.location.href = '/#location';
                    }
                  }}
                  className="text-base tracking-wide text-[#cccccc] hover:text-[#f5f0e8] transition-colors"
                >
                  Location
                </button>
                <Link href="/community-impact">
                  <div className={`text-base tracking-wide transition-colors ${
                    location === "/community-impact" ? "text-[#c0392b]" : "text-[#cccccc] hover:text-[#f5f0e8]"
                  }`}>
                    Community
                  </div>
                </Link>
                <Link href="/catering">
                  <div className={`text-base tracking-wide transition-colors ${
                    location === "/catering" ? "text-[#c0392b]" : "text-[#cccccc] hover:text-[#f5f0e8]"
                  }`}>
                    Catering
                  </div>
                </Link>
              </nav>

              {/* User (staff/admin only — no public login button) */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="hover:bg-[#1a1a1a] text-[#cccccc]">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback className="text-xs">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline">{user.firstName}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-72 p-3 bg-[#111111] border border-[rgba(192,57,43,0.3)] shadow-2xl shadow-black/50">
                      <div className="space-y-2">
                        <button
                          onClick={() => navigate("/profile")}
                          className="w-full flex items-center space-x-3 px-4 py-3 bg-[#1a1a1a] hover:bg-[#222222] border border-[rgba(192,57,43,0.15)] hover:border-[rgba(192,57,43,0.4)] transition-all duration-200"
                        >
                          <div className="flex items-center justify-center w-9 h-9 bg-[#0a0a0a]">
                            <User className="h-4 w-4 text-[#c0392b]" />
                          </div>
                          <span className="font-medium text-[#cccccc] text-sm tracking-wide">My Profile</span>
                        </button>

                        <button
                          onClick={() => navigate("/community-impact")}
                          className="w-full flex items-center space-x-3 px-4 py-3 bg-[#1a1a1a] hover:bg-[#222222] border border-[rgba(192,57,43,0.15)] hover:border-[rgba(192,57,43,0.4)] transition-all duration-200"
                        >
                          <div className="flex items-center justify-center w-9 h-9 bg-[#0a0a0a]">
                            <HeartHandshake className="h-4 w-4 text-[#c0392b]" />
                          </div>
                          <span className="font-medium text-[#cccccc] text-sm tracking-wide">Community Impact</span>
                        </button>

                        {(user.role === "employee" || user.isAdmin) && (
                          <button
                            onClick={() => navigate("/employee/clock")}
                            className="w-full flex items-center space-x-3 px-4 py-3 bg-[#1a1a1a] hover:bg-[#222222] border border-[rgba(192,57,43,0.15)] hover:border-[rgba(192,57,43,0.4)] transition-all duration-200"
                          >
                            <div className="flex items-center justify-center w-9 h-9 bg-[#0a0a0a]">
                              <Clock className="h-4 w-4 text-[#c0392b]" />
                            </div>
                            <span className="font-medium text-[#cccccc] text-sm tracking-wide">Clock In/Out</span>
                          </button>
                        )}

                        {user.isAdmin && (
                          <>
                            <div className="h-px bg-[rgba(192,57,43,0.2)] my-2"></div>
                            <button
                              onClick={() => navigate("/admin/dashboard")}
                              className="w-full flex items-center space-x-3 px-4 py-3 bg-[#1a1a1a] hover:bg-[#222222] border border-[rgba(192,57,43,0.15)] hover:border-[rgba(192,57,43,0.4)] transition-all duration-200"
                            >
                              <div className="flex items-center justify-center w-9 h-9 bg-[#0a0a0a]">
                                <BarChart3 className="h-4 w-4 text-[#c0392b]" />
                              </div>
                              <span className="font-medium text-[#cccccc] text-sm tracking-wide">Admin Dashboard</span>
                            </button>
                          </>
                        )}

                        {(user.isAdmin || user.role === "employee" || user.role === "kitchen" || user.role === "manager") && (
                          <>
                            {!user.isAdmin && <div className="h-px bg-[rgba(192,57,43,0.2)] my-2"></div>}
                            <button
                              onClick={() => navigate("/kitchen")}
                              className="w-full flex items-center space-x-3 px-4 py-3 bg-[#1a1a1a] hover:bg-[#222222] border border-[rgba(192,57,43,0.15)] hover:border-[rgba(192,57,43,0.4)] transition-all duration-200"
                            >
                              <div className="flex items-center justify-center w-9 h-9 bg-[#0a0a0a]">
                                <ChefHat className="h-4 w-4 text-[#c0392b]" />
                              </div>
                              <span className="font-medium text-[#cccccc] text-sm tracking-wide">Kitchen Display</span>
                            </button>
                          </>
                        )}

                        <div className="h-px bg-[rgba(192,57,43,0.2)] my-2"></div>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 bg-[#1a1a1a] hover:bg-[#200808] border border-[rgba(192,57,43,0.15)] hover:border-[rgba(192,57,43,0.6)] transition-all duration-200"
                        >
                          <div className="flex items-center justify-center w-9 h-9 bg-[#0a0a0a]">
                            <LogOut className="h-4 w-4 text-[#c0392b]" />
                          </div>
                          <span className="font-medium text-[#c0392b] text-sm tracking-wide">Log Out</span>
                        </button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Top Header */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0a] border-b border-[rgba(192,57,43,0.2)] lg:hidden" style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          top: 'env(safe-area-inset-top, 0px)'
        }}>
          {/* Announcement Bar */}
          <div className="w-full text-center py-1.5 px-4 text-[0.6rem] tracking-widest uppercase" style={{ background: '#c0392b', color: '#fff' }}>
            Now Open in Murrells Inlet
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="w-20"></div>
            <Link href="/" className="flex items-center space-x-2">
              <img src={logoUrl} alt={companyName} className="h-9" />
            </Link>
            <div className="flex items-center space-x-2 w-20 justify-end">
              {user && (
                <Button variant="ghost" size="sm" onClick={() => setMobileProfileMenuOpen(true)} className="text-[#cccccc] hover:text-[#f5f0e8]">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-[#c0392b] text-white">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a] shadow-lg shadow-black/50 border-t border-[rgba(192,57,43,0.4)] lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div className="flex justify-around items-center h-16 px-2">
            <Link href="/">
              <div className={`flex flex-col items-center space-y-1 transition-colors ${
                location === "/" ? "text-[#c0392b]" : "text-[#888888] hover:text-[#f5f0e8]"
              }`}>
                <Home className="h-6 w-6" />
                <span className="text-xs tracking-wide uppercase" style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}>Home</span>
              </div>
            </Link>

            <Link href="/menu">
              <div className={`flex flex-col items-center space-y-1 transition-colors ${
                location === "/menu" ? "text-[#c0392b]" : "text-[#888888] hover:text-[#f5f0e8]"
              }`}>
                <MenuIcon className="h-6 w-6" />
                <span className="text-xs tracking-wide uppercase" style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}>Menu</span>
              </div>
            </Link>

            {/* Catering Button - conditionally shown based on admin setting */}
            {cateringButtonEnabled && (
              <Link href="/catering">
                <div className={`flex flex-col items-center space-y-1 transition-colors ${
                  location === "/catering" ? "text-[#c0392b]" : "text-[#888888] hover:text-[#f5f0e8]"
                }`}>
                  <UtensilsCrossed className="h-6 w-6" />
                  <span className="text-xs tracking-wide uppercase" style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}>Catering</span>
                </div>
              </Link>
            )}

            <Link href="/community-impact">
              <div className={`flex flex-col items-center space-y-1 transition-colors ${
                location === "/community-impact" ? "text-[#c0392b]" : "text-[#888888] hover:text-[#f5f0e8]"
              }`}>
                <HeartHandshake className="h-6 w-6" />
                <span className="text-xs tracking-wide uppercase" style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}>Community</span>
              </div>
            </Link>

            {user && (
              <div
                className={`flex flex-col items-center space-y-1 cursor-pointer transition-colors ${
                  location === "/profile" ? "text-[#c0392b]" : "text-[#888888] hover:text-[#f5f0e8]"
                }`}
                onClick={() => setMobileProfileMenuOpen(true)}
              >
                <User className="h-6 w-6" />
                <span className="text-xs tracking-wide uppercase" style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}>Profile</span>
              </div>
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
