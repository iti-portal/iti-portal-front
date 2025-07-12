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
      animation: {
        'fadeIn': 'fadeIn 1s ease-in',
        'fadeInUp': 'fadeInUp 0.8s ease-out',
        'scaleIn': 'scaleIn 0.6s ease-out',
        'slideInLeft': 'slideInLeft 0.8s ease-out',
        'slideInRight': 'slideInRight 0.8s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        scaleIn: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.8)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
        },
        slideInLeft: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(-50px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)'
          },
        },
        slideInRight: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(50px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { 
            boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)',
          },
          '100%': { 
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6)',
          },
        },
      },
      animationDelay: {
        '0': '0s',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1s',
        '2000': '2s',
        '4000': '4s',
      },
    },
  },
  plugins: [],
}

