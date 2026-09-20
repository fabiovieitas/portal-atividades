/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          light: '#fdfbf7',
          DEFAULT: '#f5efe4',
          dark: '#e9dfce',
          border: '#d6c6ad',
          shadow: '#b8a58a',
        },
        ink: {
          DEFAULT: '#2c2521',
          light: '#52473f',
          faded: '#786c62',
        },
        stamp: {
          red: '#b91c1c',
          'red-hover': '#991b1b',
          green: '#15803d',
          'green-hover': '#166534',
          blue: '#1d4ed8',
        },
        brass: {
          light: '#f59e0b',
          DEFAULT: '#d97706',
          dark: '#b45309',
        }
      },
      fontFamily: {
        typewriter: ['"Special Elite"', '"Courier Prime"', 'Courier', 'monospace'],
        heading: ['"Cinzel"', 'Georgia', 'serif'],
        handwritten: ['"Caveat"', 'cursive'],
        sans: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'vintage': '0 4px 20px -2px rgba(44, 37, 33, 0.25), 0 2px 6px -1px rgba(44, 37, 33, 0.15)',
        'stamp': 'inset 0 1px 3px rgba(0,0,0,0.3), 0 2px 5px rgba(0,0,0,0.2)',
        'key': '0 5px 0 #3a322c, 0 8px 12px rgba(0,0,0,0.35)',
        'key-pressed': '0 1px 0 #3a322c, 0 2px 4px rgba(0,0,0,0.2)',
      }
    },
  },
  plugins: [],
}
