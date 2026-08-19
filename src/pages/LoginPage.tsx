import { DownUpText, LeftRightText } from '../components/AnimatedText'
import HomeIndicator from '../components/HomeIndicator'
import MobileScreen from '../components/MobileScreen'
import SocialButton from '../components/SocialButton'
import { SPLASH_VISIBLE_DURATION } from '../components/SplashOverlay'
import Wordmark from '../components/Wordmark'
import { startOAuthLogin } from '../api/auth'
import { useNavigate } from 'react-router-dom'

/** 등장 애니메이션 길이 (ms) */
const INTRO_DURATION = 1500

/** Figma `A-01 로그인` (node 410:2269) */
export default function LoginPage() {
  // 백엔드 인가 시작 URL로 이동한다. 로그인 완료 후 쿠키 발급 → /auth/:provider/callback으로 돌아온다.
  const handleKakaoLogin = () => startOAuthLogin('kakao')
  const handleNaverLogin = () => startOAuthLogin('naver')
  const navigate = useNavigate()

  return (
    <MobileScreen>
      <div className="flex w-full flex-1 flex-col">
        {/* 스플래시가 걷힌 뒤 순서대로 등장하도록 지연을 준다 */}
        <div className="mt-[80px] flex flex-col gap-[10px]">
          <DownUpText
            delay={SPLASH_VISIBLE_DURATION + 200}
            duration={INTRO_DURATION}
          >
            <Wordmark className="text-[40px] text-brand" />
          </DownUpText>

          <h1 className="text-[24px] font-bold leading-normal text-black">
            <LeftRightText
              delay={SPLASH_VISIBLE_DURATION + 500}
              duration={INTRO_DURATION}
            >
              시술의 완성
              <br />
              오늘부터 더마데이와 함께해요!
            </LeftRightText>
          </h1>
        </div>

        <div className="mt-auto flex w-full flex-col gap-[15px]">
          <SocialButton provider="kakao" onClick={handleKakaoLogin} />
          <SocialButton provider="naver" onClick={handleNaverLogin} />
          <button onClick={() => navigate('/procedurepages/start')} className="rounded-lg bg-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-300">
            개발자 모드
          </button>
        </div>
      </div>

      <HomeIndicator />
    </MobileScreen>
  )
}
