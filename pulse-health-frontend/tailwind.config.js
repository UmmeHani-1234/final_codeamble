/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        app: "#F7F9FC",
        surface: "#FFFFFF",
        line: "rgba(15,23,42,0.07)",
        ink: "#0F172A",
        secondary: "#475066",
        muted: "#94A0B2",
        brand: {
          DEFAULT: "#2554E8",
          dark: "#1E46CC",
          tint: "#EAF0FE",
        },
        indigo: {
          DEFAULT: "#6C5CE7",
          tint: "#EFEBFC",
        },
        danger: {
          DEFAULT: "#C0324B",
          tint: "#FBE9ED",
        },
        warning: {
          DEFAULT: "#AD7A0A",
          tint: "#FBF1DE",
        },
        success: {
          DEFAULT: "#1E8E5A",
          tint: "#E7F6EE",
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
