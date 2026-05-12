/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          900: "#0f172a",
          800: "#1e293b",
          700: "#334155",
          600: "#475569",
          500: "#64748b",
          400: "#94a3b8",
          300: "#cbd5e1",
          200: "#e2e8f0",
          100: "#f1f5f9",
        },
        indigo: {
          600: "#4f46e5",
          500: "#6366f1",
        },
        cyan: {
          600: "#0891b2",
          500: "#06b6d4",
        },
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
      backdropBlur: {
        xl: "20px",
      },
    },
  },
  plugins: [],
}

