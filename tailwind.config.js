/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        'maxw768': {'max': '768px'}, 
      }
    },
  },
  plugins: [require("daisyui"), require("tailwind-scrollbar-hide")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#3d73bd",
          secondary: "#6dbc3d",
        },
      },
    ],
  },
};
