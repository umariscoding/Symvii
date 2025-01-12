const { colors } = require('./src/constants/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        background: colors.background,
        text: colors.text,
        border: colors.border,
        overlay: colors.overlay,
        custom: {
          primary: colors.primary.DEFAULT,
          'primary-hover': colors.primary.hover
        }
      },
    },
  },
  plugins: [],
}