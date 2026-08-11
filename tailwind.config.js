/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#18BFB1',
        kakao: '#FEE102',
        naver: '#03CF5D',
        gray: {
          base: '#FFFFFF',
          100: '#F6F6F6',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },
      },
      fontFamily: {
        sans: ['"Pretendard Variable"', 'Pretendard', 'system-ui', 'sans-serif'],
        // 로고 워드마크 전용
        logo: ['Pattaya', 'cursive'],
      },
    },
  },
  plugins: [],
}
