module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Anton SC", "sans-serif"],
        sans: ["Montserrat", "sans-serif"],
      },
      colors: {
        bgColor: "#FDF1E6", // Warm cream background (less light)
        primary: "#FF9644",
        primaryDark: "#E07D2C",
        primaryLight: "#FFB47B",
        textPrimary: "#2C1810", // Dark brown for main text
        textSecondary: "#5C4033", // Medium brown for secondary text
        cardBg: "#FFFFFF", // White for cards
        cardBorder: "#E8D5C4", // Warm border color
        accent: "#FF9644",
      },
    },
  },
  plugins: [],
};
