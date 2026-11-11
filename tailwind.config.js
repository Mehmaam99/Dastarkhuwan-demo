/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        emeraldBrand: '#0B3D2E',
        goldBrand: '#D4AF37',
        ivoryBrand: '#F8F6ED',
        charcoalBrand: '#1A1A1A',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        urdu: ['"Noto Nastaliq Urdu"', '"Noto Naskh Arabic"', 'serif'],
      },
    },
  },
  plugins: [],
};
