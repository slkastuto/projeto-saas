/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1F3A8A",
        green: "#2FA84F",
        textPrimary: "#1F2937",
        textSecondary: "#6B7280",
        border: "#E5E7EB",
        background: "#F7F9FC",
      },
      borderRadius: {
        auth: "24px",
        card: "20px",
        xl: "16px",
      },
      boxShadow: {
        card: "0 10px 25px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
