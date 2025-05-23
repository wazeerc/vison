import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate"; // Changed from require

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'inter': ['Inter', 'sans-serif'],
				'poppins': ['Poppins', 'sans-serif'],
				'montserrat': ['Montserrat', 'sans-serif'],
				'pacifico': ['Pacifico', 'cursive'],
				'nunito': ['Nunito Sans', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				vison: {
					blue: '#D3E4FD',
					'blue-dark': '#33C3F0',
					peach: '#FDE1D3',
					'peach-dark': '#FEC6A1',
					bg: '#F1F0FB',
					charcoal: '#403E43',
					'dark-charcoal': '#221F26',
					purple: '#9b87f5',
					'purple-dark': '#7E69AB',
					'purple-darker': '#6E59A5',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in': {
					'0%': { opacity: '0', transform: 'translateX(-10px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'pulse-gentle': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.03)' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' },
				},				'shine': { // Added shine animation
					'0%': { backgroundPosition: '-200% center' },
					'100%': { backgroundPosition: '200% center' },
				},				'view-enter': {
					'0%': { opacity: '0', transform: 'translateY(8px)' },
					'30%': { opacity: '0.5', transform: 'translateY(5px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'view-exit': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'70%': { opacity: '0.5', transform: 'translateY(-5px)' },
					'100%': { opacity: '0', transform: 'translateY(-8px)' },
				},
				'spin-y': {
          '0%': { transform: 'rotateZ(0deg)' },
          '100%': { transform: 'rotateZ(360deg)' },
        },
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				'pulse-gentle': 'pulse-gentle 3s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'shine': 'shine 2s linear infinite', // Added shine animation
				'view-enter': 'view-enter 0.3s ease-in',
				'view-exit': 'view-exit 0.3s ease-out',
				'spin-y': 'spin-y 5s ease infinite both alternate',
			},
			boxShadow: {
				'soft': '0 4px 12px rgba(0, 0, 0, 0.05)',
				'soft-lg': '0 8px 24px rgba(0, 0, 0, 0.08)',
				'purple': '0 4px 14px rgba(155, 135, 245, 0.2)',
				'purple-lg': '0 8px 28px rgba(155, 135, 245, 0.25)',
				'glow': '0 0 15px rgba(155, 135, 245, 0.5)',
			}
		}
	},
	plugins: [tailwindcssAnimate], // Use the imported variable
} satisfies Config;
