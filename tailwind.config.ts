import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F5F2EC",
        paper: "#FBF9F4",
        ink: "#160A33",
        violet: {
          DEFAULT: "#7229FF",
          deep: "#5B1FD9",
          tint: "#EDE4FF",
        },
        lavender: "#C9BCFF",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
      },
      animation: {
        marquee: "marquee 50s linear infinite",
        "fade-up": "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fadeIn 0.6s ease-out both",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
