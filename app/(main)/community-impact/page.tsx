import type { Metadata } from 'next';
import CommunityContent from './community-content';

export const metadata: Metadata = {
  title: "Community Impact | Francesco's Pizza Kitchen",
  description: "Francesco's Pizza Kitchen gives back to the Murrells Inlet community. Support local charities when you order -- use a charity promo code and we donate a portion to their cause.",
  alternates: { canonical: "https://francescosmurrellsinlet.com/community-impact" },
};

export default function CommunityImpactPage() {
  return <CommunityContent />;
}
