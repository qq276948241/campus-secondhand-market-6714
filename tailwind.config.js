/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        primary: {
          50: '#FFF5EE',
          100: '#FFE8D6',
          200: '#FFD4B3',
          300: '#FFB880',
          400: '#FF9E57',
          500: '#FF8C42',
          600: '#E6732A',
          700: '#CC5E1F',
          800: '#A34915',
          900: '#7A360D',
        },
        orange: {
          warm: '#FF8C42',
          'warm-dark': '#E6732A',
          'warm-light': '#FFD4B8',
        }
      },
      boxShadow: {
        card: '0 2px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'card': '12px',
      }
    },
  },
  plugins: [],
};
