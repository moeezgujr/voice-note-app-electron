/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Ensure Tailwind scans your JSX/TSX files
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class', // Enable dark mode via the 'dark' class
  corePlugins: {
    preflight: false, // You already disabled preflight for a custom reset
  },
  plugins: [],
}
