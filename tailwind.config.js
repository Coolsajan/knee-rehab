/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        teal: {
          50: '#E1F5EE',
          100: '#9FE1CB',
          200: '#5DCAA5',
          400: '#1D9E75',
          600: '#0F6E56',
          800: '#085041',
          900: '#04342C',
        },
        amber: {
          50: '#FAEEDA',
          100: '#FAC775',
          400: '#EF9F27',
          600: '#BA7517',
          800: '#854F0B',
        },
        coral: {
          50: '#FAECE7',
          100: '#F5C4B3',
          400: '#D85A30',
          600: '#993C1D',
          800: '#712B13',
        },
        red: {
          50: '#FCEBEB',
          100: '#F7C1C1',
          400: '#E24B4A',
          600: '#A32D2D',
        },
      },
    },
  },
  plugins: [],
};
