import type { Metadata } from "next";
import PayContent from "./pay-content";

export const metadata: Metadata = {
  title: "Complete Payment | Francesco's Pizza & Pasta",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function PayPage({ params }: Props) {
  const { token } = await params;
  return <PayContent token={token} />;
}
