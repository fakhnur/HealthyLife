/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        hl: {
          dark: '#183D3A',
          teal: '#27C5B8',
          'teal-deep': '#16877E',
          mint: '#E2F9F7',
          'mint-light': '#EDF3F2',
          surface: '#FCFDFD',
          muted: '#718481',
          border: '#DFE9E7',
        },
      },
      fontFamily: {
        sans: ['"Work Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        4.5: '1.125rem',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
