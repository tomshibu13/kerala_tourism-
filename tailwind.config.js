/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kerala-green': '#10B981', // Professional Flat Emerald
        'kerala-green-dark': '#065F46', // Deep Emerald
        'kerala-teal': '#0ea5e9',  // Flat Sky Blue (secondary)
        'kerala-teal-light': '#38bdf8',
        'kerala-white': '#F8FAFC', // Crisp clean slate-white
        'kerala-charcoal': '#0F172A', // Flat Deep Slate Backgound
        'kerala-charcoal-light': '#1E293B', // Flat Slate Cards
        'kerala-gold': '#EAB308', // Flat Gold
        'kerala-gold-light': '#FDE047', 
      },
      fontFamily: {
        'heading': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
