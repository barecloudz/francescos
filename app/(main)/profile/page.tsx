import type { Metadata } from "next";
import ProfileContent from "./profile-content";

export const metadata: Metadata = {
  title: "My Profile | Francesco's Pizza & Pasta",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <ProfileContent />;
}
