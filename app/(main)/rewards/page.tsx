import type { Metadata } from "next";
import RewardsContent from "./rewards-content";

export const metadata: Metadata = {
  title: "Rewards | Francesco's Pizza & Pasta",
  description: "Check your reward points and redeem exclusive offers at Francesco's Pizza & Pasta.",
  robots: { index: false, follow: false },
};

export default function RewardsPage() {
  return <RewardsContent />;
}
