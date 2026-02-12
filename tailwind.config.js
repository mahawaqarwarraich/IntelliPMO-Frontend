/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1a237e",
          dark: "#0d1542",
        },
        accent: {
          DEFAULT: "#0097a7",
          hover: "#00838f",
        },
      },
      fontFamily: {
        sans: ["Segoe UI", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.08)",
        "focus-accent": "0 0 0 3px rgba(0, 151, 167, 0.2)",
      },
    },
  },
  plugins: [],
};
