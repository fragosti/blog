const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: [
    './src/assets/js/**/*.js',
    './src/site/**/*.njk',
    './src/site/**/*.md',
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["'Inter'", ...defaultTheme.fontFamily.sans],
        secondary: ["'Noto Sans'", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {},
  plugins: [],
}
