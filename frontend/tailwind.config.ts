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
          DEFAULT: "#2563EB",
          light: "#3b82f6",
          dark: "#1d4ed8",
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
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px rgba(0, 0, 0, 0.25)",
        glow: "0 0 20px rgba(37, 99, 235, 0.15)",
        "glow-green": "0 0 20px rgba(34, 197, 94, 0.15)",
        "glow-warning": "0 0 20px rgba(245, 158, 11, 0.15)",
        "glow-danger": "0 0 20px rgba(239, 68, 68, 0.15)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
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
