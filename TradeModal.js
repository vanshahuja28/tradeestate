/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bull: '#00c853',
        bear: '#ff3d57',
        ink: '#0b0f19',
        panel: '#121826',
        accent: '#7c5cff'
      },
      boxShadow: {
        glow: '0 0 25px rgba(124,92,255,0.35)'
      }
    }
  },
  plugins: []
};
