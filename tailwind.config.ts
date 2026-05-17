import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#FF4500",
          gold: "#FFD700",
          cream: "#FFF8F0",
          dark: "#1a1a1a",
          "whatsapp": "#25D366",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "drift": "drift 8s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 69, 0, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 69, 0, 0.6)" },
        },
        drift: {
          "0%, 100%": { transform: "translateX(0px)" },
          "50%": { transform: "translateX(10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
