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
        // Nunito (self-hosted via next/font at build — no runtime FOUT/privacy cost)
        sans: [
          "var(--font-nunito)",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
        // Fraunces — premium storybook serif for display headlines
        display: ["var(--font-fraunces)", "Georgia", "'Times New Roman'", "serif"],
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
        book: "0 1px 2px rgba(35, 17, 33, 0.18), 0 12px 28px rgba(35, 17, 33, 0.22), 0 32px 64px rgba(35, 17, 33, 0.18)",
        page: "0 2px 6px rgba(74, 37, 69, 0.10), 0 18px 40px rgba(74, 37, 69, 0.16)",
        "glow-coral": "0 12px 44px rgba(244, 129, 92, 0.38)",
        "glow-gold": "0 10px 40px rgba(212, 165, 116, 0.35)",
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "float-y": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "float-y-soft": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-7px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.15", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        "drift-slow": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "33%": { transform: "translate(6px, -10px) rotate(1.5deg)" },
          "66%": { transform: "translate(-5px, -4px) rotate(-1deg)" },
        },
        "cue-bounce": {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.7" },
          "50%": { transform: "translateY(6px)", opacity: "1" },
        },
      },
      animation: {
        "float-y": "float-y 7s ease-in-out infinite",
        "float-y-soft": "float-y-soft 9s ease-in-out infinite",
        twinkle: "twinkle 3.4s ease-in-out infinite",
        "drift-slow": "drift-slow 14s ease-in-out infinite",
        "cue-bounce": "cue-bounce 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
