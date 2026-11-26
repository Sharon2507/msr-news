/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        news: {
          red: '#9b1c1c',
          redDark: '#7a1414',
          redLight: '#c0392b',
          ink: '#1a1a1a',
          paper: '#f7f4ef',
          ash: '#e9e4d8',
          slate: '#3d3d3d',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)',
        headline: '0 10px 30px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
};
