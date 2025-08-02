/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}" // ✅ Scan all src files
  ],
  theme: {
    extend: {}
  },
  plugins: [
    require("@tailwindcss/forms") // ✅ optional, better form styling
  ]
};
