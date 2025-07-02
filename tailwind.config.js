/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        primary: '#1B5FA3',
        'primary-dark': '#154B82',
        'primary-mid': '#18548F',
        'primary-light': '#3A75C1',
        secondary: '#1E7F66',
        'secondary-dark': '#18604F',
        'gray-bg': '#F5F7FA',
        'gray-border': '#C5CBD2',
        'gray-text': '#333333',
      }
    },
  },
  plugins: [],
}

