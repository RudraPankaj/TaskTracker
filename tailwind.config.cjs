/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0b2545',
          800: '#082033'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ]
}
