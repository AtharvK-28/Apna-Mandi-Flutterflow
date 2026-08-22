/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', 'cursive'],
        body: ['Mukta', 'sans-serif'],
      },
      colors: {
        // Brand palette — CSS-var driven so dark mode restyles every page.
        // "light" tokens act as subtle tints, "dark" tokens as strong accents;
        // their actual lightness flips per theme (see src/styles/index.css).
        terracotta: {
          DEFAULT: 'hsl(var(--terracotta) / <alpha-value>)',
          light: 'hsl(var(--terracotta-light) / <alpha-value>)',
          dark: 'hsl(var(--terracotta-dark) / <alpha-value>)',
        },
        turmeric: {
          DEFAULT: 'hsl(var(--turmeric) / <alpha-value>)',
          light: 'hsl(var(--turmeric-light) / <alpha-value>)',
          dark: 'hsl(var(--turmeric-dark) / <alpha-value>)',
        },
        leaf: {
          DEFAULT: 'hsl(var(--leaf) / <alpha-value>)',
          light: 'hsl(var(--leaf-light) / <alpha-value>)',
          dark: 'hsl(var(--leaf-dark) / <alpha-value>)',
        },
        chili: {
          DEFAULT: 'hsl(var(--chili) / <alpha-value>)',
          light: 'hsl(var(--chili-light) / <alpha-value>)',
        },
        paper: {
          DEFAULT: 'hsl(var(--paper) / <alpha-value>)',
          light: 'hsl(var(--paper-light) / <alpha-value>)',
          dark: 'hsl(var(--paper-dark) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'hsl(var(--ink) / <alpha-value>)',
          light: 'hsl(var(--ink-light) / <alpha-value>)',
          medium: 'hsl(var(--ink-medium) / <alpha-value>)',
        },
        sidebar: { DEFAULT: '#221912', light: '#2e231a' },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'elevation-1': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'elevation-2': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elevation-3': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'elevation-4': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'elevation-5': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-success': '0 0 20px rgba(34, 197, 94, 0.3)',
        'glow-warning': '0 0 20px rgba(245, 158, 11, 0.3)',
        'glow-error': '0 0 20px rgba(239, 68, 68, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-gentle': 'pulseGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%)',
        'gradient-secondary': 'linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--secondary) / 0.8) 100%)',
        'gradient-success': 'linear-gradient(135deg, hsl(var(--success)) 0%, hsl(var(--success) / 0.8) 100%)',
        'gradient-warning': 'linear-gradient(135deg, hsl(var(--warning)) 0%, hsl(var(--warning) / 0.8) 100%)',
        'gradient-error': 'linear-gradient(135deg, hsl(var(--error)) 0%, hsl(var(--error) / 0.8) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
    require('tailwindcss-elevation'),
  ],
}