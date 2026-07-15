/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F1111",
        muted: "#565959",
        paper: "#EAEDED",
        card: "#FFFFFF",
        nav: {
          DEFAULT: "#131921",
          secondary: "#232F3E",
        },
        brand: {
          orange: "#FF9900",
          "orange-dark": "#E47911",
          yellow: "#FFD814",
          "yellow-hover": "#F7CA00",
        },
        link: "#007185",
        success: "#067D62",
        danger: "#B12704",
        line: "#D5D9D9",
        "line-light": "#E3E6E6",
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 5px rgba(15,17,17,0.08)",
        "card-hover": "0 4px 12px rgba(15,17,17,0.15)",
        nav: "0 2px 4px rgba(0,0,0,0.2)",
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
