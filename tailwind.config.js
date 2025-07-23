// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2B1B2F',
        secondary: '#FAD79B',
        tertiary: '#F0E8E0',
        rosewood: '#5A3A4B',
      },
    },
  },
  plugins: [],
};
