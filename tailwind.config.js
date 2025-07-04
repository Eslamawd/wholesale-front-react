// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Your main HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // <--- This is the most common and important one!
    // If you have components outside 'src', add their paths too, e.g., './public/**/*.html'
  ],
  theme: {
    extend: {
      // Your custom colors, fonts, etc. go here
    },
  },
  plugins: [],
}