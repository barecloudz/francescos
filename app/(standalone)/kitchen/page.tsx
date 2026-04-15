import type { Metadata } from 'next';
import KitchenContent from './kitchen-content';

export const metadata: Metadata = {
  title: "Kitchen Display | Francesco's",
  robots: { index: false, follow: false },
};

export default function KitchenPage() {
  return <KitchenContent />;
}
