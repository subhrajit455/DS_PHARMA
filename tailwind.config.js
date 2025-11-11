/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        medical: {
          blue: '#4A90E2',
          green: '#7ED321',
          lightBlue: '#B8E6FF',
          mint: '#A8E6CF',
          teal: '#4ECDC4',
          navBg: '#9ECCC7',
        },
        dsPharma: {
          gradient: {
            start: '#A8E6CF',
            mid: '#88D8C0', 
            end: '#7FCDCD'
          },
          text: '#4ECDC4',
          nav: '#9ECCC7'
        }
      },
      fontFamily: {
        sans: ['Gyrotrope'],
        gyrotrope: ['Gyrotrope'],
      },
      backgroundImage: {
        'gradient-medical': 'linear-gradient(135deg, #A8E6CF 0%, #88D8C0 50%, #7FCDCD 100%)',
        'ds-pharma': 'linear-gradient(135deg, #A8E6CF 0%, #88D8C0 50%, #7FCDCD 100%)',
      },
      fontSize: {
        '14xl': '14rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
