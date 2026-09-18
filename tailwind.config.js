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
        // Deep obsidian canvas & surface levels (Dark Mode - Primary)
        canvas: {
          dark: '#06090e',       // Cinematic canvas (Dark Mode)
          light: '#f8fafc',      // Clean slate canvas (Light Mode)
        },
        surface: {
          base: '#061D15',       // Primary level 1 container
          card: '#0A261D',       // Level 2 tool cards & formula containers
          elevated: '#0F3529',   // Modals, dropdowns, floating panels
          border: 'rgba(255, 255, 255, 0.08)',
          'border-light': '#E5E0D8',
        },
        // Precision Accents (Fintech / Industrial High-Contrast)
        emerald: {
          glow: '#00DC82',
          DEFAULT: '#05DF8E',    // Primary CTA accent (UpFound Electric Mint)
          hover: '#10F09C',
          muted: 'rgba(5, 223, 142, 0.12)',
          border: 'rgba(5, 223, 142, 0.25)',
        },
        bronze: {
          DEFAULT: '#C4653A',    // Warm Terracotta/Bronze accent (Chase/OneCard)
          hover: '#D4754A',
          muted: 'rgba(196, 101, 58, 0.15)',
          border: 'rgba(196, 101, 58, 0.3)',
        },
        // High-density text tokens
        ink: {
          primary: '#F8FAFC',    // High-contrast metrics & titles (slate-50)
          secondary: '#CBD5E1',  // Parameter text & descriptions (slate-300)
          muted: '#64748B',      // Engineering labels & units (slate-500)
          dark: '#1C1917',       // Light mode high contrast
          'dark-muted': '#78716C',// Light mode muted
        },
        // Legacy MechKit compat tokens
        'mech-blue': '#2563eb',
        'mech-orange': '#ea580c',
        'mech-dark': '#0f172a',
        'mech-card': '#1e293b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.9rem' }], // 11px micro-labels
        '3xs': ['0.625rem', { lineHeight: '0.8rem' }],  // 10px engineering units
      },
      spacing: {
        '4.5': '1.125rem', // 18px
        '18': '4.5rem',    // 72px
      },
      borderRadius: {
        'pill': '9999px',
        '2xl': '1rem',      // 16px cards
        '3xl': '1.25rem',   // 20px hero modules
      },
      boxShadow: {
        // Strict ban on heavy drop shadows. Micro ambient diffusion & specular glow only:
        'specular-top': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        'emerald-glow': '0 0 20px -3px rgba(5, 223, 142, 0.25)',
        'bronze-glow': '0 0 20px -3px rgba(196, 101, 58, 0.25)',
        'subtle-ambient': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
        'none': 'none',
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'radial-emerald-glow': 'radial-gradient(circle at 50% 0%, rgba(5, 223, 142, 0.15) 0%, transparent 70%)',
        'radial-bronze-glow': 'radial-gradient(circle at 50% 0%, rgba(196, 101, 58, 0.12) 0%, transparent 70%)',
        'grid-pattern-dark': 'radial-gradient(rgba(5, 223, 142, 0.1) 1px, transparent 1px)',
        'grid-pattern-light': 'radial-gradient(rgba(132, 83, 60, 0.1) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
