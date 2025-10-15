export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      primary: { DEFAULT: '#ffd000ff', dark: '#ffbf00ff', light: '#FFDB58' },
      secondary: { DEFAULT: '#FFA500', dark: '#FF8C00' },
      accent: {
        yellow: '#FFFF00',
        gold: '#FFD700',
        mustard: '#FFDB58',
        orange: '#FFA500',
        darkOrange: '#FF8C00',
      },
      // 👇 Mantén los colores base de Tailwind también
      white: '#ffffff',
      black: '#000000',
      gray: {
        100: '#f7fafc',
        200: '#edf2f7',
        300: '#e2e8f0',
        400: '#cbd5e0',
        500: '#a0aec0',
        600: '#718096',
        700: '#4a5568',
        800: '#2d3748',
        900: '#1a202c',
      },
    },
    fontFamily: {
      sans: ['Montserrat', 'ui-sans-serif', 'system-ui'],
    },
    extend: {},
  },
  plugins: [],
}
