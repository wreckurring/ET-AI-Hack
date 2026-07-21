/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          900: '#070b14',
          800: '#0d1527',
          700: '#142038',
          600: '#1d2f50',
          accent: '#00f0ff',
          neonGreen: '#00ff66',
          danger: '#ff2a5f',
          warning: '#ffb703',
        }
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #070b14 0%, #0d1527 50%, #142038 100%)',
        'glass-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
      }
    },
  },
  plugins: [],
}
