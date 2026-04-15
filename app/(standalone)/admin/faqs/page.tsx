import type { Metadata } from 'next';
import AdminFaqsContent from './admin-faqs-content';

export const metadata: Metadata = {
  title: "Admin - FAQs | Francesco's",
  robots: { index: false, follow: false },
};

export default function AdminFaqsPage() {
  return <AdminFaqsContent />;
}
