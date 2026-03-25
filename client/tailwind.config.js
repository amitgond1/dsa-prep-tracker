/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0f0f1a",
        card: "#1a1a2e",
        accent: "#7c3aed",
        cyan: "#06b6d4"
      }
    }
  },
  plugins: []
};
