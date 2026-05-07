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
        },
        mint: {
          DEFAULT: "#A8DDB5", // secondary accent (Sparky chips, badges)
          50: "#F2FAF4",
          100: "#DCF1E2",
          400: "#B7E3C2",
          500: "#A8DDB5",
          600: "#7FCB91",
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
        // Reserved for kid-facing display only — to be loaded as woff2 later
        display: ["'Quicksand Variable'", "sans-serif"],
      },
      maxWidth: {
        "section": "72rem", // hero sections
        "prose-narrow": "36rem",
      },
      borderRadius: {
        button: "12px", // softer than spine's 6px — kid-friendly
        card: "20px",
      },
      boxShadow: {
        card: "0 4px 14px rgba(74, 37, 69, 0.08)",
        cardHover: "0 8px 24px rgba(74, 37, 69, 0.14)",
      },
    },
  },
  plugins: [],
};
export default config;
