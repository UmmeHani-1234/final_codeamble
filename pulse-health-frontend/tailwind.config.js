/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        app: "#F7F9FC",
        surface: "#FFFFFF",
        line: "#E2E8F0",
        ink: "#0F172A",
        secondary: "#64748B",
        muted: "#94A3B8",
        brand: {
          DEFAULT: "#2563EB",
          dark: "#1D4ED8",
          tint: "#EFF6FF",
        },
        info: {
          DEFAULT: "#2563EB",
          tint: "#EFF6FF",
        },
        danger: {
          DEFAULT: "#EF4444",
          tint: "#FEE2E2",
        },
        warning: {
          DEFAULT: "#F59E0B",
          tint: "#FEF3C7",
        },
        success: {
          DEFAULT: "#22C55E",
          tint: "#DCFCE7",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px rgba(15,23,42,0.04)",
        pop: "0 12px 32px rgba(15,23,42,0.08)",
      },
      borderRadius: {
        "2xl": "18px",
        "3xl": "22px",
      },
    },
  },
  plugins: [],
};
