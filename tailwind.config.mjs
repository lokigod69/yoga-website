/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx}', // Scan JS/JSX files in src/app/
    './app/**/*.{js,jsx}', // Scan App Router files (if any outside src/)
  ],
  theme: {
    extend: {
      colors: {
        'jet-black': '#1E1E2F',
        'cultured': '#F5F4F0',
        'timberwolf': '#D9CFCC',
        'lilac': '#D5B9D2',
        'royal-purple': '#8F7A98',
      },
    },
  },
  plugins: [],
};