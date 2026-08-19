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
      keyframes: {
        // 로딩 문구 교체 — 아래에서 올라오며 나타나고, 위로 빠지며 사라진다
        'step-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'step-out': {
          from: { opacity: '1', transform: 'translateY(0)' },
          to: { opacity: '0', transform: 'translateY(-12px)' },
        },
        /**
         * 점 하나가 커졌다가 작아진다. 점마다 시차를 주면
         * 링 전체로는 '큰 점'이 돌아가는 것처럼 보인다.
         */
        'dot-fade': {
          from: { transform: 'scale(1)' },
          to: { transform: 'scale(0.2)' },
        },
        /** WHS 로딩 아이콘의 막대가 순서대로 늘어났다 줄어든다 (Lottie 대체) */
        'bar-grow': {
          '0%, 100%': { transform: 'scaleX(0.3)' },
          '50%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'step-in': 'step-in 320ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'step-out': 'step-out 240ms cubic-bezier(0.4, 0, 1, 1) both',
        // 점 하나의 크기 변화. 시차는 각 점의 animationDelay로 준다 (Lottie 대체)
        'dot-fade': 'dot-fade 1.2s linear infinite',
        'bar-grow': 'bar-grow 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
