/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172A3A",
        muted: "#64748B",
        paper: "#F5F7F5",
        card: "#FFFFFF",
        nav: {
          DEFAULT: "#173F4F",
          secondary: "#1E5662",
        },
        brand: {
          orange: "#F26B4F",
          "orange-dark": "#D9513A",
          yellow: "#F6C85F",
          "yellow-hover": "#E8B545",
        },
        link: "#087E8B",
        success: "#2A9D8F",
        danger: "#C84B4B",
        line: "#D8E2E0",
        "line-light": "#EAF0EE",
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 24px rgba(23,63,79,0.07)",
        "card-hover": "0 14px 30px rgba(23,63,79,0.13)",
        nav: "0 6px 18px rgba(23,63,79,0.14)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
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
