/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

const tailwindConfig = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [typography],
};

export default tailwindConfig;
