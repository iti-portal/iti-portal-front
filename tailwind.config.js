// filepath: tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'iti-primary': '#901b20',
        'iti-primary-dark': '#7a1619',
        'iti-primary-light': '#c41c24',
        'iti-accent': '#f59e0b',
        'iti-secondary': '#fef3c7',
      },
      backgroundImage: {
        'iti-gradient': 'linear-gradient(135deg, #901b20 0%, #c41c24 100%)',
        'iti-gradient-dark': 'linear-gradient(135deg, #7a1619 0%, #901b20 100%)',
        'iti-gradient-light': 'linear-gradient(135deg, #fef3c7 0%, #fef3c7 100%)',
      },
    },
  },
  plugins: [],
}

