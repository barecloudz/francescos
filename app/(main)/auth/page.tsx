import type { Metadata } from 'next';
import AuthContent from './auth-content';

export const metadata: Metadata = {
  title: "Login or Sign Up | Francesco's Pizza & Pasta",
  description: "Login to your Francesco's account or create a new one to order delicious authentic Italian pizza online and earn rewards.",
  robots: { index: false, follow: false },
};

export default function AuthPage() {
  return <AuthContent />;
}
