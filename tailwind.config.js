/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF1B6B",
        accent: "#FFD23F",
        "pink-bright": "#FF1B6B",
        "pink-dark": "#E8175D",
      },
    },
  },
  plugins: [],
};
