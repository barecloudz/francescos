import type { Metadata } from 'next';
import CateringContent from './catering-content';

export const metadata: Metadata = {
  title: "Catering | Francesco's Pizza Kitchen - Murrells Inlet, SC",
  description: "Book Francesco's for your next catering event. Corporate lunches, weddings, parties & more. Authentic Italian food for groups of any size in the Murrells Inlet area.",
  alternates: { canonical: "https://francescosmurrellsinlet.com/catering" },
};

export default function CateringPage() {
  return <CateringContent />;
}
