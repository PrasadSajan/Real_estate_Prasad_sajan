// tailwind.config.js
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
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
      fontFamily: {
        serif: ['System', 'serif'],
        sans: ['System', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
