/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          'web3': {
            'primary': '#06b6d4', // Cyan
            'secondary': '#8b5cf6', // Violet
            'accent': '#f472b6', // Pink
            'dark': '#0f172a', // Slate 900
            'light': '#e2e8f0', // Slate 200
          },
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          mono: ['Space Mono', 'monospace'],
        },
        animation: {
          'glow': 'glow 2s ease-in-out infinite alternate',
        },
        keyframes: {
          glow: {
            'from': { boxShadow: '0 0 10px #06b6d4' },
            'to': { boxShadow: '0 0 20px #8b5cf6, 0 0 30px #f472b6' },
          }
        },
      },
    },
    plugins: [],
  }