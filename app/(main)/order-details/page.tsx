import type { Metadata } from "next";
import { Suspense } from "react";
import OrderDetailsContent from "./order-details-content";

export const metadata: Metadata = {
  title: "Order Details | Francesco's Pizza Kitchen",
  robots: { index: false, follow: false },
};

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-600">Loading...</p></div>}>
      <OrderDetailsContent />
    </Suspense>
  );
}
