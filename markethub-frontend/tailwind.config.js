/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#F5F5F5",
        muted: "#A3A3A3",
        paper: "#111111",
        card: "#1F1F1F",
        nav: {
          DEFAULT: "#0A0A0A",
          secondary: "#171717",
        },
        brand: {
          orange: "#E5E5E5",
          "orange-dark": "#FFFFFF",
          yellow: "#FFFFFF",
          "yellow-hover": "#D4D4D4",
        },
        link: "#D4D4D4",
        success: "#86EFAC",
        danger: "#FCA5A5",
        line: "#404040",
        "line-light": "#2A2A2A",
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.28)",
        "card-hover": "0 14px 30px rgba(0,0,0,0.42)",
        nav: "0 6px 18px rgba(0,0,0,0.36)",
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
