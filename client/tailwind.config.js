/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAFA',
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F8FAFC',
          secondary: '#F1F5F9',
          border: '#E2E8F0',
          'border-light': '#F1F5F9',
          dark: '#0F172A',
        },
        ink: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
          subtle: '#CBD5E1',
        },
        accent: {
          cobalt: '#2563EB',
          'cobalt-hover': '#1D4ED8',
          'cobalt-light': '#EFF6FF',
          'cobalt-border': '#DBEAFE',
          emerald: '#059669',
          'emerald-hover': '#047857',
          'emerald-light': '#ECFDF5',
          'emerald-border': '#D1FAE5',
          amber: '#D97706',
          'amber-hover': '#B45309',
          'amber-light': '#FFFBEB',
          'amber-border': '#FEF3C7',
          rose: '#E11D48',
          'rose-hover': '#BE123C',
          'rose-light': '#FFF1F2',
          'rose-border': '#FFE4E6',
          purple: '#7C3AED',
          'purple-light': '#FAF5FF',
          'purple-border': '#F3E8FF',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.03)',
        'card-hover': '0 4px 12px 0 rgba(15, 23, 42, 0.06), 0 2px 4px -1px rgba(15, 23, 42, 0.03)',
        'elevated': '0 10px 25px -4px rgba(15, 23, 42, 0.06), 0 4px 10px -2px rgba(15, 23, 42, 0.03)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'smooth': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 24px -2px rgba(37, 99, 235, 0.12)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
