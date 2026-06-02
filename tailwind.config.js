/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        xp: {
          blue: {
            light: '#5B9BD5',
            medium: '#245DDA',
            dark: '#1C40A3',
            start: '#3c82e6'
          },
          green: {
            start: '#388E3C',
            light: '#4CAF50',
            dark: '#1B5E20'
          },
          orange: '#FF9800',
          grey: {
            light: '#F1F0E8',
            medium: '#D8D4C8',
            dark: '#808080'
          }
        }
      },
      fontFamily: {
        ms: ['"MS Sans Serif"', 'Tahoma', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'xp-out': 'inset 1px 1px 0px #fff, inset -1px -1px 0px #808080, 1px 1px 2px rgba(0,0,0,0.5)',
        'xp-in': 'inset 1px 1px 0px #808080, inset -1px -1px 0px #fff',
        'xp-btn': 'inset 1.5px 1.5px 0px #ffffff, inset -1.5px -1.5px 0px #868686, inset 3px 3px 0px #dfdfdf, inset -3px -3px 0px #0a0a0a, 2px 2px 3px rgba(0,0,0,0.3)',
        'xp-btn-active': 'inset 1.5px 1.5px 0px #0a0a0a, inset -1.5px -1.5px 0px #ffffff, inset 3px 3px 0px #868686, inset -3px -3px 0px #dfdfdf',
      }
    },
  },
  plugins: [],
}
