/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        urbanist: ['Urbanist', 'sans-serif'],
        jakarta: ['Jakarta', 'sans-serif'],
      },
      colors: {
        'custom-blue': '#3772FF',
        'custom-grey': '#7B7B7B',
        'dark-grey': '#393939',
        'border-grey': '#636363',
        'custom-black': '#030303',
        'doc-bg': '#F7F7F7',
        'schedule-col': '#4169E1',
        'schedule-col-inner': '#D1DBF8',
        'card-layer2': '#6384E6',
        'card-layer3': '#87A1EC',
        'review-bg': '#D1DBF8',
        'custom-schedule': '#ECF0FC',
        'active-nav': '#1D2F65',
        'chat-blue': '#2E4BA0',
        'custom-grey-doc': '#F3F3F3',
      },
      boxShadow: {
        '3xl': '0 -3px 16px 0 rgba(0, 0, 0, 0.3)',
      },
    },
    plugins: [],
  },
};
