import type { Metadata } from 'next';
import EmailConfirmContent from './confirm-content';

export const metadata: Metadata = {
  title: "Email Confirmation | Francesco's",
  description: "Confirm your email address to activate your Francesco's rewards account.",
  robots: { index: false, follow: false },
};

export default function EmailConfirmPage() {
  return <EmailConfirmContent />;
}
