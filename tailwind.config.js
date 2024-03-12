/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "Home": "url('/src/Assets/3.png')",
        "Bmi": "url('/src/Assets/2.png')",

      },
    },
  },
  plugins: [],
}

