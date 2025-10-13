/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFFF00',
          dark: '#FFD700',
          light: '#FFDB58',
        },
        secondary: {
          DEFAULT: '#FFA500',
          dark: '#FF8C00',
        },
        accent: {
          yellow: '#FFFF00',
          gold: '#FFD700',
          mustard: '#FFDB58',
          orange: '#FFA500',
          darkOrange: '#FF8C00',
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}