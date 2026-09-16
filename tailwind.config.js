/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'mech-blue': '#2563eb', // Slate/Blue #2563eb
        'mech-orange': '#ea580c', // Safety Orange #ea580c
        'mech-dark': '#0f172a', // Dark background #0f172a
        'mech-card': '#1e293b', // Card background #1e293b
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
