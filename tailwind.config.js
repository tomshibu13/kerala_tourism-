/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kerala-green': '#0F6E56',
        'kerala-green-dark': '#0a5643',
        'kerala-teal': '#1D9E75',
        'kerala-teal-light': '#25c28f',
        'kerala-white': '#FAFAF8',
        'kerala-charcoal': '#1a1a18',
        'kerala-charcoal-light': '#2a2a28',
        'kerala-gold': '#D4A843',
        'kerala-gold-light': '#E8C96A',
      },
      fontFamily: {
        'heading': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
