import type { Metadata } from 'next';
import EmployeeClockContent from './employee-clock-content';

export const metadata: Metadata = {
  title: "Employee Clock | Francesco's",
  robots: { index: false, follow: false },
};

export default function EmployeeClockPage() {
  return <EmployeeClockContent />;
}
