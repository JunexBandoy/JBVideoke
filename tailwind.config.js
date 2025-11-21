/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        gloriousgold: {
          50: '#faf7ef',
          100: '#faf7ef',
          200: '#e2d1a5',
          300: '#d6be80',
          400: '#caab5a',
          500: '#b9963a',
          600: '#94782f',
          700: '#6f5a23',
          800: '#4a3c17',
          900: '#251e0b',
        },
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
    },
  },

  plugins: [require('@tailwindcss/forms')],
};
