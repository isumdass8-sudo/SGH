/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fbf7ee', 100: '#f4e9cf', 200: '#e9d29e', 300: '#deb96b',
          400: '#d5a545', 500: '#c4903a', 600: '#a3722f', 700: '#7f5a29',
          800: '#5c4222', 900: '#3d2d18'
        },
        charcoal: {
          50: '#f4f5f6', 100: '#e4e6e8', 200: '#c6cad0', 300: '#9aa1ab',
          400: '#6a7381', 500: '#4d5563', 600: '#3a404c', 700: '#2b303a',
          800: '#1d2027', 900: '#121317'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-in-out',
        slideUp: 'slideUp 0.6s ease-out'
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(24px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } }
      }
    }
  },
  plugins: []
}
