import flowbite from 'flowbite-react/tailwind';
import tailwindScroll from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', flowbite.content()],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Roboto', 'sans-serif']
      }
    }
  },
  plugins: [flowbite.plugin(), tailwindScroll]
};
