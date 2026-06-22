/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5ED',
          100: '#FFE8D6',
          200: '#FFD4B8',
          300: '#FFBA8A',
          400: '#FFA366',
          500: '#FF8C42',
          600: '#E6732A',
          700: '#CC5E1A',
          800: '#A64910',
          900: '#7F3708',
        },
      },
      boxShadow: {
        card: '0 2px 12px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
}
