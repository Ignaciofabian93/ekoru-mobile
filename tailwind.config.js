/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        cabin: ["Cabin_400Regular"],
        "cabin-medium": ["Cabin_500Medium"],
        "cabin-semibold": ["Cabin_600SemiBold"],
        "cabin-bold": ["Cabin_700Bold"],
      },
      colors: {
        primary: {
          DEFAULT: "#65a30d", // lime-600
          light: "#84cc16", // lime-500
          dark: "#4d7c0f", // lime-700
        },
      },
    },
  },
  plugins: [],
};
