import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Inklings warm pastel storybook palette (per spine §7 brand swap)
        ink: {
          DEFAULT: "#4A2545", // deep plum, primary text + headings
          50: "#FAF4F8",
          100: "#F2E5EE",
          200: "#E0C7D7",
          300: "#C8A2BB",
          400: "#A47A95",
          500: "#7D506E",
          600: "#5E3854",
          700: "#4A2545",
          800: "#371B33",
          900: "#231121",
        },
        cream: {
          DEFAULT: "#FFF6E5", // page background
          50: "#FFFEF9",
          100: "#FFF6E5",
          200: "#FBEAC9",
          300: "#F4D9A2",
        },
        coral: {
          DEFAULT: "#F4815C", // primary CTA (replaces spine orange)
          50: "#FEF1EC",
          100: "#FCDBCE",
          400: "#F69A7C",
          500: "#F4815C",
          600: "#E05F35",
          700: "#B84620",
          // AA-safe coral for TEXT/badge fills on cream/white: 4.78:1 on #FFF6E5,
          // white-on-dark 5.13:1. Keep bright DEFAULT coral for decoration only.
          dark: "#BA4A24",
        },
        mint: {
          DEFAULT: "#A8DDB5", // secondary accent (Sparky chips, badges)
          50: "#F2FAF4",
          100: "#DCF1E2",
          400: "#B7E3C2",
          500: "#A8DDB5",
          600: "#7FCB91",
          // Text/icon-safe green: 5.07:1 on white, 4.72:1 on cream. Use instead of mint-500/600 for text.
          700: "#2F7D46",
        },
        gold: {
          DEFAULT: "#D4A574", // tertiary accent, "approved" + premium tier
          400: "#DCB88E",
          500: "#D4A574",
          600: "#B8884F",
        },
      },
      fontFamily: {
        // System font stack per spine §3 — no Google Fonts (FOUT, privacy)
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
        // Brand display face for h1/h2 + hero headlines — loaded via next/font/google
        // in src/lib/fonts.ts (Fraunces, CSS var --font-fraunces). Applied site-wide
        // to headings via globals.css `@layer base`; use `font-display` directly for
        // non-heading elements (e.g. a styled eyebrow or callout) that want it too.
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      maxWidth: {
        "section": "72rem", // hero sections
        "prose-narrow": "36rem",
      },
      // Radius scale: sm 12px (buttons, inputs, chips) / card 20px / pill 9999px.
      borderRadius: {
        sm: "12px",
        button: "12px", // alias of sm — kept for existing usages
        card: "20px",
        pill: "9999px",
      },
      // Shadow scale: card + card-hover (cardHover kept as an alias).
      boxShadow: {
        card: "0 4px 14px rgba(74, 37, 69, 0.08)",
        "card-hover": "0 8px 24px rgba(74, 37, 69, 0.14)",
        cardHover: "0 8px 24px rgba(74, 37, 69, 0.14)",
      },
    },
  },
  plugins: [],
};
export default config;
