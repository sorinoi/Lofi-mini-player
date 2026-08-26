/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lofi: {
          bg: '#14161f',
          surface: '#1c1f2e',
          card: '#24283b',
          border: '#333852',
          primary: '#ff9e64',
          accent: '#7aa2f7',
          pink: '#f7768e',
          green: '#9ece6a',
          purple: '#bb9af7',
          text: '#c0caf5',
          muted: '#787c99'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    }
  },
  plugins: []
}
