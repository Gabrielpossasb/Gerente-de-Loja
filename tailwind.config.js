/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      boxShadow: {
        sm_black_inset: 'inset 0 0 8px 5px rgba(0, 0, 0, 0.1)',
        sm_black: '0 0 10px 1px rgba(0, 0, 0, 0.1)',
        sm_gray: '2px 2px 8px 0 rgba(139, 139, 139, 0.6)',
        sm_yellow: '0 0 8px 2px rgba(250, 255, 6, 1)',
        md_yellow: '0 0 6px 5px rgba(250, 252, 6, 1)',
      },
    },
  },
  plugins: [],
}