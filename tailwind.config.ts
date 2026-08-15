import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        sidebar: {
          DEFAULT: "#0f1117",
          hover: "#1a1d27",
          active: "#252836",
          border: "#1e2130",
        },
        primary: {
          DEFAULT: "#3b82f6",
          hover: "#2563eb",
        },
        card: {
          DEFAULT: "#161922",
          border: "#1e2130",
        },
      },
    },
  },
  plugins: [],
};
export default config;
