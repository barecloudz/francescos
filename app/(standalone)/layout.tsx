// Standalone layout — no header, no footer, no cart
// Used for: /vip, /kitchen, /admin/*

export default function StandaloneLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
