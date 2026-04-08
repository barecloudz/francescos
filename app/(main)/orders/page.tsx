import type { Metadata } from "next";
import OrdersContent from "./orders-content";

export const metadata: Metadata = {
  title: "My Orders | Francesco's Pizza Kitchen",
  description: "View your order history at Francesco's Pizza Kitchen.",
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return <OrdersContent />;
}
