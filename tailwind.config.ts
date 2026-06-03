import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        leaf: "#2f7d57",
        mint: "#dff6e8",
        charcoal: "#17211d",
        honey: "#e9b949"
      },
      boxShadow: {
        soft: "0 24px 70px rgba(23, 33, 29, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
