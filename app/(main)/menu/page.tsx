import type { Metadata } from 'next';
import MenuContent from './menu-content';

export const metadata: Metadata = {
  title: "Menu | Francesco's Pizza Kitchen - Murrells Inlet, SC",
  description: "Order online from Francesco's full menu. NY style pizza, pasta, calzones, subs & more. Fresh ingredients, made to order in Murrells Inlet, SC.",
  alternates: { canonical: "https://francescosmurrellsinlet.com/menu" },
};

export default function MenuPage() {
  return <MenuContent />;
}
