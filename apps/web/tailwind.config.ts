import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00D26A",
        "primary-light": "#4AE88A",
        "primary-dark": "#00A352",
        accent: "#00E5FF",
        background: "#0A0F1A",
        surface: "#111827",
        "surface-elevated": "#1F2937",
        "icon-bg": "#1F2937",
        offwhite: "#E2E8F0",
        "dark-gray": "#374151",
      },
      fontFamily: {
        display: ["var(--font-display)", "cursive"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
