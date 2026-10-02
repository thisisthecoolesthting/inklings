import type { Metadata, Viewport } from "next";
import "./globals.css";
import { brand } from "@/lib/brand";
import { SiteChrome } from "@/components/SiteChrome";
import { OrganizationJsonLd } from "@/lib/jsonld";
import { fraunces } from "@/lib/fonts";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: `${brand.name} — Build a story universe your child runs`,
  description:
    "Inklings lets kids ages 4-8 build a story universe where their characters return across every story. Voice-first, parent-approved, real printed books.",
  applicationName: brand.name,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://inklings.shop"),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: { capable: true, title: "Inklings", statusBarStyle: "default" },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: `${brand.name} — Build a story universe your child runs`,
    description:
      "A story universe studio for kids ages 4-8. Voice-first, parent-approved, where characters return in every story.",
    url: "/",
    images: [{ url: "/images/showcase/milo-moonbeam/cover.jpg", width: 1200, height: 630, alt: `${brand.name} — A story universe your child runs` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — Build a story universe your child runs`,
    description:
      "A story universe studio for kids ages 4-8. Characters return in every story.",
    images: ["/images/showcase/milo-moonbeam/cover.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF6E5",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fraunces.variable}>
      <body className="flex min-h-[100dvh] flex-col font-sans">
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
        <OrganizationJsonLd />
        <SiteChrome>
          <main className="flex-1">{children}</main>
        </SiteChrome>
      </body>
    </html>
  );
}
