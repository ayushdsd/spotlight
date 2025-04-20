/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "0",
    },
    extend: {
      colors: {
        blue: {
          50: '#e6f0f9',
          100: '#cce1f4',
          200: '#99c3e9',
          300: '#66a5de',
          400: '#3387d3',
          500: '#00347a', 
          600: '#002d69',
          700: '#002658',
          800: '#001f47',
          900: '#001836',
        },
        mono: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#101012',
        },
        black: {
          DEFAULT: '#000000',
          50: '#1a1a1a',
          100: '#333333',
          200: '#4d4d4d',
          300: '#666666',
          400: '#808080',
          500: '#999999',
          600: '#b3b3b3',
          700: '#cccccc',
          800: '#e6e6e6',
          900: '#f2f2f2',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        modern: ['Space Grotesk', 'system-ui', 'sans-serif'],
        minimal: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-in': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'slide-in-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'splash': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.5' },
          '100%': { transform: 'scale(2)', opacity: '0' }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        'tilt': {
          '0%, 100%': {
            transform: 'rotateX(0deg) rotateY(0deg)'
          },
          '25%': {
            transform: 'rotateX(2deg) rotateY(2deg)'
          },
          '75%': {
            transform: 'rotateX(-2deg) rotateY(-2deg)'
          },
        },
        'card-hover': {
          '0%': {
            transform: 'translateZ(0) rotateX(0) rotateY(0)',
            boxShadow: '0 0 0 0 rgba(0, 52, 122, 0)'
          },
          '100%': {
            transform: 'translateZ(50px) rotateX(5deg) rotateY(-5deg)',
            boxShadow: '20px 20px 60px rgba(0, 52, 122, 0.2)'
          }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out forwards',
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'slide-left': 'slideLeft 25s linear infinite',
        'slide-right': 'slideRight 25s linear infinite',
        'tilt': 'tilt 10s infinite linear',
        'float': 'float 3s ease-in-out infinite',
        'splash': 'splash 2s ease-out forwards',
        'card-hover': 'cardHover 0.3s ease-out forwards',
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(8px)',
      },
    },
  },
  darkMode: false,
  plugins: [],
}
