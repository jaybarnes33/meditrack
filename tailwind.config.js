/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#F3F6C8",
        tomato: "#EC7669",
        neutral: "#f8f8f6",
        secondary: {
          100: "#E2E2D5",
          200: "#888883",
        },
      },
    },
  },
  plugins: [],
};
