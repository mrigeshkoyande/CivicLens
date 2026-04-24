import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Obsidian dark theme
        primary: {
          DEFAULT: "#a78bfa",
          hover: "#8b5cf6",
          foreground: "#ffffff",
        },
        background: {
          DEFAULT: "#09090b",
          secondary: "#0c0c0f",
        },
        surface: {
          DEFAULT: "#111114",
          container: "#18181b",
          elevated: "#1c1c1f",
          high: "#27272a",
        },
        border: {
          DEFAULT: "#27272a",
          muted: "#1c1c1f",
        },
        text: {
          primary: "#fafafa",
          secondary: "#a1a1aa",
          muted: "#71717a",
        },
        accent: {
          violet: "#a78bfa",
          emerald: "#34d399",
          red: "#ef4444",
          yellow: "#f59e0b",
          blue: "#60a5fa",
        },
        // Shadcn compatibility
        foreground: "#fafafa",
        card: {
          DEFAULT: "#18181b",
          foreground: "#fafafa",
        },
        popover: {
          DEFAULT: "#18181b",
          foreground: "#fafafa",
        },
        secondary: {
          DEFAULT: "#27272a",
          foreground: "#fafafa",
        },
        muted: {
          DEFAULT: "#27272a",
          foreground: "#a1a1aa",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#fafafa",
        },
        input: "#27272a",
        ring: "#a78bfa",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        violet: "0 0 20px rgba(167, 139, 250, 0.15)",
        emerald: "0 0 20px rgba(52, 211, 153, 0.15)",
        card: "0 1px 3px rgba(0,0,0,0.5)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "count-up": "countUp 0.6s ease-out",
        shimmer: "shimmer 1.5s infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(167, 139, 250, 0.2)" },
          "50%": { boxShadow: "0 0 25px rgba(167, 139, 250, 0.5)" },
        },
        countUp: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-violet": "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
        "gradient-emerald": "linear-gradient(135deg, #34d399 0%, #059669 100%)",
        shimmer:
          "linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.1) 50%, transparent 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
