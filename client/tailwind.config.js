/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { ink: "#151b2d", cloud: "#f5f7ff", violet: "#6657ee" },
      boxShadow: { card: "0 14px 40px rgba(48, 45, 92, 0.08)" },
    },
  },
  plugins: [],
};
