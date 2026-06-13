/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './frontend/src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f3ff',
          100: '#e1e7fe',
          200: '#c8d4fd',
          300: '#a3b8fc',
          400: '#7992fa',
          500: '#546af6',
          600: '#3c4ceb',
          700: '#303bd7',
          800: '#2a32b0',
          900: '#272f8c',
          950: '#1b1f54'
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif']
      }
    }
  },
  plugins: []
};
