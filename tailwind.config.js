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
        'primary-light': '#3A75C1',
        accent: '#D97B1B',
        'accent-light': '#F0A760',
        'gray-bg': '#F5F7FA',
        'gray-border': '#E1E4E8',
        'gray-text': '#333333',
      }
    },
  },
  plugins: [],
}

