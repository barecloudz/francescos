"use client";

import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CartSidebar from "@/components/cart/cart-sidebar";
import LoginModalWrapper from "@/components/auth/login-modal-wrapper";
import SnowFall from "@/components/animations/SnowFall";
import { ChristmasCountdownButton } from "@/components/christmas/christmas-countdown-button";
import { AdventCalendarModal } from "@/components/christmas/advent-calendar-modal";
import { UpdateBanner } from "@/components/update-banner";
import { useAnimations } from "@/hooks/use-animations";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [adventCalendarOpen, setAdventCalendarOpen] = useState(false);
  const { snowEnabled } = useAnimations();
  const pathname = usePathname();

  const showSnow = snowEnabled && pathname !== '/menu';

  return (
    <>
      {/* City approval banner */}
      <div className="w-full bg-yellow-400 text-yellow-900 text-center py-2 px-4 text-xs font-semibold tracking-wide z-50">
        We are awaiting final approval from the city — opening very soon! Stay tuned.
      </div>
      <UpdateBanner />
      <Header />
      <CartSidebar />
      <LoginModalWrapper />

      {showSnow && <SnowFall />}

      <div className="hidden lg:block">
        <ChristmasCountdownButton onClick={() => setAdventCalendarOpen(true)} />
      </div>
      <AdventCalendarModal
        open={adventCalendarOpen}
        onClose={() => setAdventCalendarOpen(false)}
      />

      {children}

      <Footer />
    </>
  );
}
