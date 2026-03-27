import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Best Pizza & Pasta in Murrells Inlet SC | Francesco's Pizza & Pasta",
  description:
    "Best pizza and pasta in Murrells Inlet! Francesco's Pizza & Pasta serves authentic Italian cuisine with fresh ingredients. Pizza, pasta, calzones & more. Order online now!",
  keywords:
    "pizza murrells inlet, pasta murrells inlet, italian restaurant murrells inlet, best pizza murrells inlet, pizza delivery murrells inlet, calzones murrells inlet, francescos pizza",
  authors: [{ name: "Francesco's Pizza & Pasta" }],
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  alternates: {
    canonical: "https://francescosmurrellsinlet.com",
  },
  openGraph: {
    type: "website",
    url: "https://francescosmurrellsinlet.com",
    title: "Best Pizza & Pasta in Murrells Inlet SC | Francesco's Pizza & Pasta",
    description:
      "Best pizza and pasta in Murrells Inlet! Francesco's Pizza & Pasta serves authentic Italian cuisine with fresh ingredients. Order online now!",
    images: [{ url: "https://francescosmurrellsinlet.com/images/hero-bg.jpeg" }],
    siteName: "Francesco's Pizza & Pasta",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Pizza & Pasta in Murrells Inlet | Francesco's Pizza & Pasta",
    description:
      "Best pizza and pasta in Murrells Inlet! Authentic Italian cuisine with fresh ingredients. Order online now!",
    images: ["https://francescosmurrellsinlet.com/images/hero-bg.jpeg"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              "@id": "https://francescosmurrellsinlet.com",
              name: "Francesco's Pizza & Pasta",
              image: "https://francescosmurrellsinlet.com/images/hero-bg.jpeg",
              logo: "https://francescosmurrellsinlet.com/images/logo.png",
              url: "https://francescosmurrellsinlet.com",
              telephone: "+1-843-299-2700",
              priceRange: "$$",
              servesCuisine: ["Italian", "Pizza", "Pasta"],
              address: {
                "@type": "PostalAddress",
                streetAddress: "2539 US-17S, #6",
                addressLocality: "Murrells Inlet",
                addressRegion: "SC",
                postalCode: "29576",
                addressCountry: "US",
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                  opens: "11:00",
                  closes: "21:00",
                },
              ],
              menu: "https://francescosmurrellsinlet.com/menu",
              sameAs: [
                "https://www.facebook.com/profile.php?id=61580096004134",
                "https://www.instagram.com/francescosmurrellsinlet/",
                "https://www.tiktok.com/@francescosofmurrellsinlet",
              ],
            }),
          }}
        />
      </head>
      <body>
        <Providers>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
