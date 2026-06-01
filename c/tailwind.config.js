/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#EB6914"
            },
            fontFamily: {
                sans: ["Quicksand", "sans-serif"]
            }
        }
    },
    plugins: []
};
