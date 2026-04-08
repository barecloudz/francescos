import type { Metadata } from 'next';
import HomePageContent from './home-content';

export const metadata: Metadata = {
  title: "Best Pizza in Murrells Inlet | Francesco's Pizza Kitchen",
  description: "Best pizza in Murrells Inlet! Francesco's Pizza Kitchen offers hand-tossed NY style pizza, pasta, calzones & subs. Family-owned pizzeria on US-17. Order online for pickup!",
  keywords: "pizza near me, best pizza in murrells inlet, pizza murrells inlet, murrells inlet pizza, pizza delivery murrells inlet",
  alternates: { canonical: "https://francescosmurrellsinlet.com" },
  openGraph: {
    title: "Best Pizza in Murrells Inlet | Francesco's Pizza Kitchen",
    description: "Best pizza in Murrells Inlet! Hand-tossed NY style pizza, pasta, calzones & subs.",
    url: "https://francescosmurrellsinlet.com",
    siteName: "Francesco's Pizza Kitchen",
    images: [{ url: "https://francescosmurrellsinlet.com/images/hero-bg.jpeg" }],
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return <HomePageContent />;
}
