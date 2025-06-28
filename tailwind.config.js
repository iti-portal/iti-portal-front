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
    },
  },
  plugins: [],
}

