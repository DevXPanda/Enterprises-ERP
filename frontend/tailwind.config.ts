import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "rgb(var(--bg-navy-rgb) / <alpha-value>)",
          50: "var(--bg-navy-50)",
          100: "var(--bg-navy-100)",
          200: "var(--bg-navy-200)",
          300: "var(--bg-navy-300)",
          400: "var(--bg-navy-400)",
          500: "var(--bg-navy-500)",
        },
        sidebar: "rgb(var(--bg-sidebar-rgb) / <alpha-value>)",
        card: "rgb(var(--bg-card-rgb) / <alpha-value>)",
        primary: {
          DEFAULT: "#2F6FED",        /* Refined enterprise blue */
          light: "#5D91F3",
          dark: "#245DD8",         /* Refined hover state */
        },
        success: {
          DEFAULT: "#22C55E",
          light: "#4ade80",
          dark: "#16a34a",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#fbbf24",
          dark: "#d97706",
        },
        purple: {
          DEFAULT: "#8B5CF6",
          light: "#a78bfa",
          dark: "#7c3aed",
        },
        danger: {
          DEFAULT: "#EF4444",
          light: "#f87171",
          dark: "#dc2626",
        },
        muted: "rgb(var(--color-muted-rgb) / <alpha-value>)",
        border: "rgb(var(--color-border-rgb) / <alpha-value>)",
        white: "rgb(var(--text-white-rgb) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)",
        glow: "none",
        "glow-green": "none",
        "glow-warning": "none",
        "glow-danger": "none",
        glass: "none",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
