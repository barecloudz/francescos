import type { Metadata } from 'next';
import VipContent from './vip-content';

export const metadata: Metadata = {
  title: "VIP Members | Francesco's Pizza Kitchen",
  description: "Join Francesco's VIP list for exclusive SMS discounts, birthday offers, and early access to new menu items.",
};

export default function VipPage() {
  return <VipContent />;
}
