const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        primary: ["'Inter'", ...defaultTheme.fontFamily.sans],
        secondary: ["'Catamaran'", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {},
  plugins: [],
}
