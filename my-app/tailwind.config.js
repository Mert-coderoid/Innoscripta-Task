/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "primary": "#14171A",
        "secondary": "#14171A",
        "accent": "#657786",
        "neutral": "#E1E8ED",
        "success": "#17BF63",
        "info": "#1C9CEA",
        "warning": "#F45D22",
        "danger": "#E0245E",
        "light": "#F5F8FA",
        "dark": "#14171A",
        "white": "#FFFFFF",
        "black": "#000000",
        "transparent": "transparent",
        "current": "currentColor",
      },
    },
  },
  plugins: [],
}