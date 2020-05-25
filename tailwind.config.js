const { theme, variants } = require('tailwindcss/defaultConfig')

module.exports = {
  purge: [
    './src/assets/js/**/*.js',
    './src/site/**/*.njk',
    './src/site/**/*.md',
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["'Inter'", ...theme.fontFamily.sans],
        secondary: ["'Noto Sans'", ...theme.fontFamily.sans],
      },
    },
  },
  variants: {
    borderColor: ['dark', 'dark-hover', ...variants.borderColor],
    textColor: ['dark', 'dark-hover', ...variants.textColor],
    backgroundColor: ['dark', 'dark-hover', ...variants.backgroundColor],
  },
  plugins: [require('tailwindcss-dark-mode')()],
}
