/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rosewood: {
          50: '#fdf2f4',
          100: '#fbe6ea',
          200: '#f7d0d8',
          300: '#f0aab8',
          400: '#e5778f',
          500: '#d54868',
          600: '#bf2d4e',
          700: '#a1213e',
          800: '#861e36',
          900: '#711d31',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e6ede6',
          200: '#cfdccf',
          500: '#6f8b6d',
          700: '#435842',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
