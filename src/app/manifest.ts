import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Inklings",
    short_name: "Inklings",
    description: "A story universe studio for kids ages 4-8. Voice-first, parent-approved.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FFF6E5",
    theme_color: "#FFF6E5",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
