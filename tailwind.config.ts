import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        floreer: {
          bg:     "#FAFAF8",
          dark:   "#1A1815",
          gold:   "#B8864A",
          card:   "#F3F0EB",
          muted:  "#9A9188",
          border: "#E3DDD6",
          broto:  "#F0C9B8",
          botao:  "#C98A6E",
          plena:  "#B68A4E",
        },
      },
      fontFamily: {
        sans:  ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
