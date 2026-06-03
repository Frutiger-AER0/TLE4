/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                darkBlue: "#14213D",
                blue: "#0047AB",
                purple: "#7B2CBF",
                lightPurple: "#CDB4DB",
                yellow: "#F4C430",
                offWhite: "#F8F9FA"
            },
        },
    },
    plugins: [],
}

