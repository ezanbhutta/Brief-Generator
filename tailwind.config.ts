import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // HaseebMadeIt brand · light theme (matches CSR Pulse / Reports)
        bg: "#FAFAFE",
        "bg-raised": "#F4F2FA",
        "bg-card": "#FFFFFF",
        "bg-hover": "#F0EEFA",
        "bg-ink": "#160A33",
        border: "#E8E5F3",
        "border-hi": "#D4CFEC",
        ink: "#160A33",
        muted: "#534A78",
        dim: "#8B82A8",
        violet: {
          DEFAULT: "#7229FF",
          dim: "#5E1FD8",
          glow: "#9F66FF",
          bg: "#F1EBFF",
        },
        mint: { DEFAULT: "#10B981", bg: "#E7F8F1" },
        amber: { DEFAULT: "#F59E0B", bg: "#FEF4DE" },
        coral: { DEFAULT: "#EF4444", bg: "#FDE9E9" },
        cyan: { DEFAULT: "#0EA5E9", bg: "#E5F4FE" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        label: "0.15em",
      },
      borderRadius: {
        xl: "12px",
      },
      animation: {
        "fade-up": "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fadeIn 0.3s ease-out both",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
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
