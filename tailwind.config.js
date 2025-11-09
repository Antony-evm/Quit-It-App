const palette = require('./src/shared/theme/palette.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          ink: palette.brand.ink,
          'ink-dark': palette.brand.inkDark,
          cream: palette.brand.cream,
          nav: palette.brand.nav,
        },
        surface: {
          base: palette.tokens.backgroundPrimary,
          muted: palette.tokens.backgroundMuted,
        },
        text: {
          primary: palette.tokens.textPrimary,
          secondary: palette.tokens.textSecondary,
        },
        accent: {
          primary: palette.tokens.accentPrimary,
          muted: palette.tokens.accentMuted,
        },
        border: {
          DEFAULT: palette.tokens.borderDefault,
        },
        state: {
          error: palette.tokens.systemError,
        },
      },
    },
  },
  plugins: [],
};
