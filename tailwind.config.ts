import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-lato)', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0f172a', // Slate 900
          light: '#1e293b',   // Slate 800
        },
        accent: {
          DEFAULT: '#d97706', // Amber 600
          hover: '#b45309',   // Amber 700
        }
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slow-zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 1s ease-out forwards',
        'slow-zoom': 'slow-zoom 20s linear infinite alternate',
      }
    },
  },
  plugins: [],
}
export default config
