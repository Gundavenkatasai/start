/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        surface: {
          subtle: '#F8FAFC',
          secondary: '#F1F5F9',
          border: '#E2E8F0',
          dark: '#0F172A',
        },
        ink: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        },
        accent: {
          cobalt: '#2563EB',
          'cobalt-hover': '#1D4ED8',
          emerald: '#059669',
          'emerald-light': '#D1FAE5',
          amber: '#D97706',
          'amber-light': '#FEF3C7',
          rose: '#E11D48',
          'rose-light': '#FFE4E6',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'elevated': '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
        'glow': '0 0 20px -3px rgba(37, 99, 235, 0.15)',
      },
    },
  },
  plugins: [],
}
