/** @type {import('tailwindcss').Config} */
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
    darkMode: ['class'],
    content: [
      './pages/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
      './app/**/*.{ts,tsx}',
      './src/**/*.{ts,tsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', ...fontFamily.sans],
        },
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)',
        },
        colors: {
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          card: {
            DEFAULT: 'hsl(var(--card))',
            foreground: 'hsl(var(--card-foreground))',
          },
          popover: {
            DEFAULT: 'hsl(var(--popover))',
            foreground: 'hsl(var(--popover-foreground))',
          },
          primary: {
            DEFAULT: 'hsl(var(--primary))',
            foreground: 'hsl(var(--primary-foreground))',
          },
          secondary: {
            DEFAULT: 'hsl(var(--secondary))',
            foreground: 'hsl(var(--secondary-foreground))',
          },
          muted: {
            DEFAULT: 'hsl(var(--muted))',
            foreground: 'hsl(var(--muted-foreground))',
          },
          accent: {
            DEFAULT: 'hsl(var(--accent))',
            foreground: 'hsl(var(--accent-foreground))',
          },
          destructive: {
            DEFAULT: 'hsl(var(--destructive))',
            foreground: 'hsl(var(--destructive-foreground))',
          },
          success: {
            DEFAULT: 'hsl(var(--success))',
            foreground: 'hsl(var(--success-foreground))',
          },
          warning: {
            DEFAULT: 'hsl(var(--warning))',
            foreground: 'hsl(var(--warning-foreground))',
          },
          border: 'hsl(var(--border))',
          input: 'hsl(var(--input))',
          ring: 'hsl(var(--ring))',
          chart: {
            1: 'hsl(var(--chart-1))',
            2: 'hsl(var(--chart-2))',
            3: 'hsl(var(--chart-3))',
            4: 'hsl(var(--chart-4))',
            5: 'hsl(var(--chart-5))',
          },
        },
        backgroundImage: {
          'gradient-primary': 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
          'gradient-accent': 'linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--primary)) 100%)',
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        },
        boxShadow: {
          'glow': '0 0 20px hsl(var(--primary) / 0.3)',
          'glow-lg': '0 0 40px hsl(var(--primary) / 0.4)',
          'glow-accent': '0 0 20px hsl(var(--accent) / 0.3)',
        },
        keyframes: {
          'accordion-down': {
            from: {
              height: '0',
            },
            to: {
              height: 'var(--radix-accordion-content-height)',
            },
          },
          'accordion-up': {
            from: {
              height: 'var(--radix-accordion-content-height)',
            },
            to: {
              height: '0',
            },
          },
          'fade-in': {
            from: {
              opacity: '0',
              transform: 'translateY(10px)',
            },
            to: {
              opacity: '1',
              transform: 'translateY(0)',
            },
          },
          'slide-up': {
            from: {
              transform: 'translateY(20px)',
              opacity: '0',
            },
            to: {
              transform: 'translateY(0)',
              opacity: '1',
            },
          },
          'pulse-glow': {
            '0%, 100%': {
              boxShadow: '0 0 20px hsl(var(--primary) / 0.3)',
            },
            '50%': {
              boxShadow: '0 0 40px hsl(var(--primary) / 0.5)',
            },
          },
        },
        animation: {
          'accordion-down': 'accordion-down 0.2s ease-out',
          'accordion-up': 'accordion-up 0.2s ease-out',
          'fade-in': 'fade-in 0.5s ease-in',
          'slide-up': 'slide-up 0.3s ease-out',
          'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        },
      },
    },
    plugins: [require('tailwindcss-animate')],
  };
