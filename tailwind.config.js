const { theme, variants } = require('tailwindcss/defaultConfig')

module.exports = {
  content: ['./src/assets/js/**/*.js', './src/**/*.njk', './src/**/*.md'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        primary: ["'Inter'", ...theme.fontFamily.sans],
        secondary: ["'Noto Sans'", ...theme.fontFamily.sans],
      },
    },
  },
}
