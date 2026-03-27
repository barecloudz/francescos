import type { Metadata } from "next";
import { Suspense } from "react";
import OrderSuccessContent from "./order-success-content";

export const metadata: Metadata = {
  title: "Order Confirmed | Francesco's Pizza & Pasta",
  robots: { index: false, follow: false },
};

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mx-auto"></div></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
