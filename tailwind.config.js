const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      display: ['Montserrat', 'sans-serif'],
      body: ['Open Sans', 'sans-serif'],
    },
    extend: {
      screens: {
        'max-md': { max: '767px' },
        'max-lg': { max: '1023px' },
      },
      colors: {
        accent: {
          DEFAULT: '#F78E1E',
          dark: '#D26D00',
        },
        app: '#171717',
        subtle: '#262626',
        'subtle-light': '#333333',
        'ui-element': '#404040',
        'low-contrast': '#D4D4D4',
        'high-contrast': '#FFFFFF',
        interactive: '#979797',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    plugin(function ({ addComponents }) {
      addComponents({
        '.display-1': {
          font: '600 3.75rem/3.75rem "Montserrat", sans-serif',
          '@media (max-width: 767px)': {
            font: '600 2.25rem/2.25rem "Montserrat", sans-serif',
          }
        },
        '.display-2': {
          font: '600 3rem/3rem "Montserrat", sans-serif',
          '@media (max-width: 767px)': {
            font: '600 2rem/2rem "Montserrat", sans-serif',
          }
        },
        '.title-1': {
          font: '600 2.25rem/2.5rem "Montserrat", sans-serif',
          '@media (max-width: 767px)': {
            font: '600 1.625rem/1.875rem "Montserrat", sans-serif',
          }
        },
        '.title-2': {
          font: '600 1.75rem/2.25rem "Montserrat", sans-serif',
          '@media (max-width: 767px)': {
            font: '600 1.375rem/1.875rem "Montserrat", sans-serif',
          }
        },
        '.title-3': {
          font: '600 1.25rem/1.75rem "Montserrat", sans-serif',
          '@media (max-width: 767px)': {
            font: '600 1.125rem/1.625rem "Montserrat", sans-serif',
          }
        },
        '.subtitle-1': {
          font: '700 1.25rem/2rem "Open Sans", sans-serif',
          '@media (max-width: 767px)': {
            font: '700 1.125rem/1.875rem "Open Sans", sans-serif',
          }
        },
        '.body-1': {
          font: '400 1.125rem/2rem "Open Sans", sans-serif',
        },
        '.body-2': {
          font: '400 1rem/1.5rem "Open Sans", sans-serif',
        },
        '.body-3': {
          font: '400 0.875rem/1.375rem "Open Sans", sans-serif',
        },
        '.label-1': {
          font: '700 1rem/1.5rem "Open Sans", sans-serif',
        },
        '.label-2': {
          font: '700 0.875rem/1.375rem "Open Sans", sans-serif',
          'text-transform': 'uppercase',
        },
      });
    }),
  ],
};
