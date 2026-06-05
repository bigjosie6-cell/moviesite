/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        primary: "hsl(215, 85%, 55%)",
        accent: "hsl(340, 80%, 70%)",
        background: "hsl(215, 15%, 10%)",
        surface: "hsl(215, 15%, 14%)",
        glass: "rgba(255,255,255,0.08)"
      },
      backdropBlur: {
        xs: "2px"
      }
    }
  },
  plugins: []
};
