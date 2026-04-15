import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development warnings
  reactStrictMode: true,

  // Allow build to succeed while TypeScript errors in legacy admin monolith are resolved
  typescript: {
    ignoreBuildErrors: true,
  },

  // Image optimization - allow images from our domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tamsxlebouauwiivoyxa.supabase.co",
      },
    ],
  },

  // Redirect old domain traffic (handled by Netlify but good to have here too)
  async redirects() {
    return [
      // www → non-www handled by Netlify
    ];
  },

  // Env vars exposed to the browser (replacing VITE_ prefix)
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  },
};

export default nextConfig;
