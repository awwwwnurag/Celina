/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          burgundy: 'var(--color-secondary, #1D4E89)',
          dark: '#1c1c1c',
          light: '#FCFBF7',
          border: '#B08D57'
        },
        'main': 'var(--color-main, #2E86AB)',
        'primary': 'var(--color-primary, #0D5C63)',
        'secondary': 'var(--color-secondary, #1D4E89)',
        'gold': 'var(--color-gold, #B08D57)',
        'grey': '#c2c8da',
        'braight-grey': '#FCFBF7',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Poppins', 'sans-serif'], // Set default sans font to Plus Jakarta Sans
        display: ['"Plus Jakarta Sans"', 'Poppins', 'Space Grotesk', 'sans-serif'],
        syne: ['Poppins', 'Syne', 'sans-serif'],
        'Poppins': ['Poppins', 'sans-serif'],
        'Roboto': ['Roboto', 'sans-serif'],
      },
      fontSize: {
        'title-hero': 'clamp(2.5rem, -1.6667rem + 20.8333vw, 4.0625rem)',
        'content-hero': 'clamp(1.25rem, -0.0833rem + 6.6667vw, 1.75rem)',
        'title-card': 'clamp(1.75rem, 1.0833rem + 3.3333vw, 2rem)',
        'subtitle-card': 'clamp(1.25rem, 0.5833rem + 3.3333vw, 1.5rem)',
        'title-app': 'clamp(1.875rem, 0.5417rem + 6.6667vw, 2.375rem)',
        'content-app': 'clamp(1rem, 0rem + 5vw, 1.375rem)',
        'title-payday': 'clamp(2.5rem, 0rem + 12.5vw, 3.4375rem)',
        'content-payday': 'clamp(1.125rem, 0.125rem + 5vw, 1.5rem)',
      },
      backgroundImage: {
        'payday': "url('/assets/img/pay.webp')",
        'hero': "url('/assets/img/hero.webp')",
      },
      dropShadow: {
        'app': '0px 4px 60px rgba(0, 0, 0, 0.25)',
      },
      keyframes: {
        move: {
          'from': { transform: 'translate(0px, -50%)' },
          'to': { transform: 'translate(15px, -50%)' }
        },
        'wave-xxsmall': {
          '0%': { transform: 'scale(1)',  opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        'wave-xsmall': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { opacity: '1' },
          '100%': { transform: 'scale(1.87)', opacity: '0' },
        },
        'wave-small': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { opacity: '1' },
          '100%': { transform: 'scale(2.083)', opacity: '0' },
        },
        'wave-medium': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { opacity: '1' },
          '100%': { transform: 'scale(2.695)', opacity: '0' },
        },
        'wave-large': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { opacity: '1' },
          '100%': { transform: 'scale(2.385)', opacity: '0' },
        },
      },
      animation: {
        'spin-slow': 'spin 5s linear infinite',
        'move-slow': 'move .5s infinite alternate',
      }
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '10px',
        '2xl': '30px',
        'xl': '20px',
      }
    },
  },
  plugins: [],
}
