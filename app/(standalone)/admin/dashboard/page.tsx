import type { Metadata } from 'next';
import AdminDashboardContent from './admin-dashboard-content';

export const metadata: Metadata = {
  title: "Admin Dashboard | Francesco's",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return <AdminDashboardContent />;
}
