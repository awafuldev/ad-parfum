import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        porcelain: {
          DEFAULT: "#FAF9F6",
          pure: "#FFFFFF",
          warm: "#F5F3EF",
        },
        espresso: {
          DEFAULT: "#211A18",
          deep: "#140F0E",
          soft: "#2A2220",
          card: "#1D1615",
        },
        charcoal: {
          DEFAULT: "#292524",
          dark: "#1C1917",
          light: "#3F3A36",
        },
        champagne: {
          DEFAULT: "#CCA727",
          light: "#E2C358",
          dark: "#A38217",
          muted: "#C6AD83",
          glow: "rgba(204, 167, 39, 0.25)",
        },
        sand: {
          DEFAULT: "#E8E0D5",
          light: "#F0EAE1",
          dark: "#D6CCC0",
        },
        amber: {
          warm: "#8D5B28",
          deep: "#5C3615",
        },
        taupe: "#8B8076",
        smoke: "#737373",
        ash: "#A3A3A3",
        mist: "#F3F4F6",
        graphite: "#5E5E5E",
        hairline: "#E5E7EB",
      },
      fontFamily: {
        serif: [
          "Cormorant Garamond",
          "Playfair Display",
          "Georgia",
          "serif",
        ],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      letterSpacing: {
        tightDisplay: "-0.035em",
        luxury: "0.22em",
        ultraWide: "0.3em",
      },
      lineHeight: {
        tightDisplay: "0.92",
        editorial: "1.12",
      },
      borderRadius: {
        cowboy: "8px",
        bottle: "12px",
      },
      maxWidth: {
        cowboy: "1440px",
        editorial: "1600px",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.16, 1, 0.3, 1)",
        editorial: "cubic-bezier(0.65, 0, 0.35, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        sheen: {
          "0%": { transform: "translateX(-120%) rotate(25deg)" },
          "100%": { transform: "translateX(240%) rotate(25deg)" },
        },
        ambientFloat: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.75" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        revealMask: {
          "0%": { clipPath: "inset(100% 0 0 0)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
      },
      animation: {
        sheen: "sheen 3.5s cubic-bezier(0.16, 1, 0.3, 1) infinite",
        ambientFloat: "ambientFloat 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 4s ease-in-out infinite",
        fadeInUp: "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        revealMask: "revealMask 1.2s cubic-bezier(0.65, 0, 0.35, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
