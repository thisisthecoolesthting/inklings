import { Fraunces } from "next/font/google";

/**
 * Brand display typeface — used for h1/h2 and hero headline classes
 * site-wide (see globals.css `@layer base` + tailwind `fontFamily.display`).
 * Body copy keeps the existing system font stack for readability.
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});
