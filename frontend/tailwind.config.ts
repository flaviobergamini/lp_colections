import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        vinyl: {
          bg: "#111113",
          surface: "#1b1b1f",
          accent: "#e0b34d",
        },
      },
    },
  },
  plugins: [],
};

export default config;
