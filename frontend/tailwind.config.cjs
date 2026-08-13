module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"] ,
  theme: {
    extend: {
      colors: {
        primary: '#C94F3C',
        secondary: '#0E9AA7',
        bg: '#F7F7F8',
        surface: '#FFFFFF',
        text: '#222222',
        muted: '#4B4B4B',
        border: '#E6E6E9',
        success: '#1AAE9F',
        error: '#D64550'
      },
      spacing: {
        'xs': '8px',
        'sm': '12px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px'
      },
      borderRadius: {
        lg: '12px'
      }
    }
  },
  plugins: []
};