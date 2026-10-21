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
        // Luxury Contemporary Palette
        noir: {
          DEFAULT: "#111111",
          deep: "#0A0A0A",
          soft: "#1A1A1A",
          card: "#161616",
        },
        ivory: {
          DEFAULT: "#F7F6F2",
          pure: "#FFFFFF",
          warm: "#FBFBF9",
          dark: "#ECEAE3",
        },
        wine: {
          DEFAULT: "#641E32",
          hover: "#7B243D",
          dark: "#4A1524",
          light: "#8C2E49",
          glow: "rgba(100, 30, 50, 0.25)",
        },
        neutralGray: {
          DEFAULT: "#777777",
          border: "#E2E0D8",
          light: "#999999",
          dark: "#444444",
        },

        // Backward compatibility mappings - transformed to the new palette
        porcelain: {
          DEFAULT: "#F7F6F2",
          pure: "#FFFFFF",
          warm: "#FBFBF9",
        },
        espresso: {
          DEFAULT: "#111111",
          deep: "#0A0A0A",
          soft: "#1A1A1A",
          card: "#161616",
        },
        charcoal: {
          DEFAULT: "#1A1A1A",
          dark: "#0F0F0F",
          light: "#2A2A2A",
        },
        champagne: {
          DEFAULT: "#641E32", // Deep wine replaces yellow/champagne
          light: "#7B243D",
          dark: "#4A1524",
          muted: "#8C2E49",
          glow: "rgba(100, 30, 50, 0.25)",
        },
        sand: {
          DEFAULT: "#E5E3DC",
          light: "#EFECE5",
          dark: "#D6D3CA",
        },
        taupe: "#777777",
        smoke: "#666666",
        ash: "#888888",
        mist: "#F2F0EB",
        graphite: "#333333",
        hairline: "#E2E0D8",
      },
      fontFamily: {
        serif: [
          "Playfair Display",
          "Georgia",
          "serif",
        ],
        sans: [
          "Plus Jakarta Sans",
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
        cowboy: "6px",
        bottle: "10px",
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
