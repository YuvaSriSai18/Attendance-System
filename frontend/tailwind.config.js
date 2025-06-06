/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#484522',
          light: '#5a572a',
          dark: '#363419',
        },
        secondary: {
          DEFAULT: '#14B8A6',
          light: '#42C7B8',
          dark: '#0E8A7D',
        },
        accent: {
          DEFAULT: '#F7B955',
          light: '#F9C778',
          dark: '#D99B38',
        },
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(180deg, #FFFFFF 0%, #484522 100%)',
      },
    },
  },
  plugins: [],
};