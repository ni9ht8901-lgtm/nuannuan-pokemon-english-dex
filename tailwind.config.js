/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        rounded: [
          "ui-rounded",
          "Nunito",
          "Avenir Next",
          "PingFang SC",
          "system-ui",
          "sans-serif"
        ]
      },
      boxShadow: {
        soft: "0 14px 40px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};
