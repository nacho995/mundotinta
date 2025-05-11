const colors = require('tailwindcss/colors') // Importar colores por defecto

/** @type {import('tailwindcss').Config} */
const config = {
  // darkMode: 'class', // Eliminado para usar estrategia 'media' (por defecto)
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // Incluir carpeta pages si la usas
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // Incluir carpeta app
  ],
  theme: {
    extend: {
      // Paleta de colores de fantasía y ciencia ficción
      colors: {
        // Colores base directos
        background: colors.white,
        foreground: colors.slate[900],
        primary: colors.violet[600],
        secondary: colors.teal[500],
        // Colores para modo oscuro (se usarán con dark: prefijo)
        dark_background: "#090a1a", // Azul muy oscuro casi negro
        dark_foreground: colors.slate[100],
        dark_primary: colors.violet[400],
        dark_secondary: colors.teal[400],
        // Mantener fucsia si se usa en gradientes
        fuchsia: colors.fuchsia,
        // Colores para tarjetas
        card: colors.white,
        dark_card: "rgba(16, 16, 40, 0.7)",
        muted_foreground: colors.slate[500],
        dark_muted_foreground: colors.slate[400],
        // Colores de acento temáticos para fantasía/sci-fi
        fantasy: {
          primary: colors.purple[600],
          secondary: colors.fuchsia[500],
          accent: colors.amber[400],
        },
        scifi: {
          primary: colors.cyan[500], 
          secondary: colors.blue[600],
          accent: colors.emerald[400],
        },
        magic: {
          glow: colors.violet[500],
          spark: colors.amber[300],
        },
      },
      animation: {
        'blob': 'blob 7s infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'shine': 'shine 4s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'spin-very-slow': 'spin 25s linear infinite',
        'gradient-x': 'gradientX 5s ease infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'ping-slow': 'ping 4s cubic-bezier(0, 0, 0.2, 1) infinite',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 0 0 rgba(139, 92, 246, 0.4)' },
          '100%': { boxShadow: '0 0 25px 5px rgba(139, 92, 246, 0.7)' },
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        shine: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        backgroundPan: {
          '0%': { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        gradientX: {
          '0%, 100%': {
            backgroundSize: '200% 200%',
            backgroundPosition: 'left center',
          },
          '50%': {
            backgroundSize: '200% 200%',
            backgroundPosition: 'right center',
          },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.8, transform: 'scale(1)' },
          '50%': { opacity: 0.4, transform: 'scale(0.8)' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
      borderRadius: {
        lg: `0.5rem`,
        md: `calc(0.5rem - 2px)`,
        sm: "calc(0.5rem - 4px)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'grid-pattern': 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
        'space-stars': 'radial-gradient(circle, #fff 0.5px, transparent 0.5px)',
        'shiny-gradient': 'linear-gradient(90deg, #fff0 0%, #fff8 50%, #fff0 100%)',
        'cosmic-gradient': 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'magic-glow': 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(139, 92, 246, 0) 70%)',
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.purple.500"), 0 0 20px theme("colors.purple.600")',
        'neon-teal': '0 0 5px theme("colors.teal.500"), 0 0 20px theme("colors.teal.600")',
        'neon-fuchsia': '0 0 5px theme("colors.fuchsia.500"), 0 0 20px theme("colors.fuchsia.600")',
        'inner-glow': 'inset 0 0 20px 5px rgba(139, 92, 246, 0.3)',
        'glass': '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
        'book': '0 5px 15px rgba(0, 0, 0, 0.3), 0 15px 10px rgba(0, 0, 0, 0.22)',
      },
      dropShadow: {
        'glow': '0 0 8px rgba(139, 92, 246, 0.5)',
        'text': '0 2px 4px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // Plugin útil para animaciones
};
export default config; 