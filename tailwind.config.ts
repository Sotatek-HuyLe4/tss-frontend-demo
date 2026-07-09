import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx,css,scss}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx,css,scss}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
