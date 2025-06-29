/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: 'rgb(var(--background) / <alpha-value>)',
          secondary: 'rgb(var(--background-secondary) / <alpha-value>)',
        },
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        'card-foreground': 'rgb(var(--card-foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          50: '#EBF2FF',
          100: '#D7E5FF',
          200: '#AECAFF',
          300: '#85AFFF',
          400: '#5C94FF',
          500: '#3B82F6',
          600: '#0B5ED7',
          700: '#0848A8',
          800: '#06317A',
          900: '#041D4B',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          50: '#F6EBFF',
          100: '#EDD7FF',
          200: '#DBAEFF',
          300: '#C985FF',
          400: '#B85CFE',
          500: '#A855F7',
          600: '#8A0BF7',
          700: '#6A06C3',
          800: '#490486',
          900: '#29024A',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          50: '#E7FBF4',
          100: '#CFF7E9',
          200: '#9FEFD4',
          300: '#6FE7BE',
          400: '#3FDFA9',
          500: '#10B981',
          600: '#0C9267',
          700: '#086C4D',
          800: '#044634',
          900: '#02211A',
        },
        success: {
          DEFAULT: '#22C55E',
          hover: '#16A34A',
        },
        warning: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
        },
        error: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(to right, rgba(10, 10, 15, 0.8), rgba(10, 10, 15, 0.4)), radial-gradient(at top left, rgba(58, 130, 246, 0.3), transparent 50%), radial-gradient(at top right, rgba(168, 85, 247, 0.3), transparent 50%), radial-gradient(at bottom left, rgba(16, 185, 129, 0.3), transparent 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'neon-primary': '0 0 5px theme("colors.primary.400"), 0 0 20px theme("colors.primary.600")',
        'neon-secondary': '0 0 5px theme("colors.secondary.400"), 0 0 20px theme("colors.secondary.600")',
        'neon-accent': '0 0 5px theme("colors.accent.400"), 0 0 20px theme("colors.accent.600")',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    function({ addVariant }) {
      addVariant('light', '.light &');
      addVariant('dark', '.dark &');
      addVariant('glass', '.glass &');
    }
  ],
};