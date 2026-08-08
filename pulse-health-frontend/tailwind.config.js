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
          DEFAULT: "#2554E8",
          dark: "#1E40FF",
          tint: "#EFF6FF",
        },
        indigo: {
          DEFAULT: "#6C5CE7",
          tint: "#EEF2FF",
        },
        cyan: {
          DEFAULT: "#0EA5B7",
          tint: "#D1FAFA",
        },
        danger: {
          DEFAULT: "#C0324B",
          tint: "#FDE7EB",
        },
        rose: {
          DEFAULT: "#C81E4B",
          tint: "#FDE8EE",
        },
        warning: {
          DEFAULT: "#AD7A0A",
          tint: "#FEF3C7",
        },
        amber: {
          DEFAULT: "#B45309",
          tint: "#FFEDD5",
        },
        success: {
          DEFAULT: "#1E8E5A",
          tint: "#DCFCE7",
        },
        emerald: {
          DEFAULT: "#047857",
          tint: "#ECFDF5",
        },
        info: {
          DEFAULT: "#2563EB",
          tint: "#DBEAFE",
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
