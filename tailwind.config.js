/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    "./src/lib/**/*.{svelte,js,ts}",
    "./src/app.html",
    './src/*.css'
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#140d4a',
        'secondary-bg': '#69448d',
        'accent-purple': '#8835d7',
        'accent-teal': '#00CED1',
        'accent-aqua': '#41c8f9',
        'accent-blue': '#12aaff',
        'accent-pink': '#f310ff',
        'accent-coral': '#FF6B6B',
        'text-primary': '#FFFFFF',
        'text-secondary': '#e9e8ee',
        'border-gray': '#c7c6d5'
      },
      fontFamily: {
        'heading': ['Montserrat', 'sans-serif'],
        'body': ['Montserrat', 'sans-serif'],
        'mono': ['Roboto Mono', 'monospace']
      },
      spacing: {
        'xs': '8px',
        'sm': '16px',
        'md': '24px',
        'lg': '32px',
        'xl': '48px',
        'xxl': '64px'
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'full': '9999px'
      },
      transitionDuration: {
        'fast': '200ms',
        'normal': '300ms',
        'slow': '500ms'
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
}

