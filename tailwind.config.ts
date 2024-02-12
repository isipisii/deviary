import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    nextui({
      themes: {
        dark: {
          extend: "dark", // <- inherit default values from dark theme
          colors: {
            navTextColor: "#959db0",
            activeNavTextColor: "#ffffff",
            typography: "#71717A",
            background: "#00060C",
            foreground: "#ffffff",
            cardBg: "#0f131d",
            light: "#1d262e4e",
            lightHover: "#29364196",
            secondary: "#DD0DB9",
            primary: {
              50: "#3B096C",
              100: "#520F83",
              200: "#7318A2",
              300: "#9823C2",
              400: "#c031e2",
              500: "#DD0DB9",
              600: "#F182F6",
              700: "#FCADF9",
              800: "#FDD5F9",
              900: "#FEECFE",
              DEFAULT: "#DD0DB9",
              foreground: "#ffffff",
            },
            borderColor: "#232323",
            focus: "#F182F6",
          },
          layout: {
            disabledOpacity: "0.3",
            radius: {
              small: "4px",
              medium: "6px",
              large: "8px",
            },
            borderWidth: {
              small: "1px",
              medium: "2px",
              large: "3px",
            },
          },
        },
        light: {
          extend: "light",
          colors: {
            foreground: "#00060C",
            navTextColor: "#555454",
            activeNavTextColor: "#000000",
            typography: "#71717A",
            borderColor: "#cbcbcb",
            secondary: "#DD0DB9",
            light: "#c7c7c72c",
            lightHover: "#c7c7c75e",
            cardBg: "#FFFFFF",
          },
          layout: {
            disabledOpacity: "0.3",
            radius: {
              small: "4px",
              medium: "6px",
              large: "8px",
            },
            borderWidth: {
              small: "1px",
              medium: "2px",
              large: "3px",
            },
          },
        },
      },
    }),
    // require('@tailwindcss/typography'),
  ],
  darkMode: "class",
}

export default config