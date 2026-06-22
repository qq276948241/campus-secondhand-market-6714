/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF7A45',
          50: '#FFF1EB',
          100: '#FFE0D0',
          200: '#FFC2A1',
          300: '#FFA372',
          400: '#FF8543',
          500: '#FF7A45',
          600: '#E6632E',
          700: '#CC4E1C',
          800: '#B33A0E',
          900: '#992A03',
        },
      },
      borderRadius: {
        'card': '12px',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
