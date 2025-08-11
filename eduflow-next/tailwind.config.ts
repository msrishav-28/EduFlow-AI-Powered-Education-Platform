import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['"IBM Plex Serif"', 'ui-serif', 'Georgia'],
      },
      colors: {
        indigo: {
          950: '#0B0B2E',
        },
        primary: {
          DEFAULT: '#5B5FEF', // electric violet
          50: '#EEF0FF',
          100: '#E1E4FF',
          200: '#C6C8FF',
          300: '#A4A7FF',
          400: '#7C7FFF',
          500: '#5B5FEF',
          600: '#4A4ED1',
          700: '#3B3EA9',
        },
        accent: {
          DEFAULT: '#10B5A4', // teal
        },
        bg: {
          DEFAULT: '#0B0B2E',
          elevated: 'rgba(255,255,255,0.06)'
        }
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.3)',
        'glow': '0 0 0 4px rgba(91,95,239,0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
export default config
