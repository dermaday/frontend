import { useNavigate } from 'react-router-dom'
import { DownUpText, LeftRightText } from '../components/AnimatedText'
import HomeIndicator from '../components/HomeIndicator'
import MobileScreen from '../components/MobileScreen'
import SocialButton from '../components/SocialButton'
import { SPLASH_VISIBLE_DURATION } from '../components/SplashOverlay'
import Wordmark from '../components/Wordmark'

/** 등장 애니메이션 길이 (ms) */
const INTRO_DURATION = 1500

/** Figma `A-01 로그인` (node 410:2269) */
export default function LoginPage() {
  const navigate = useNavigate()

  // TODO: 백엔드 연동 — 소셜 로그인 후 발급된 토큰을 저장한다.
  const handleLogin = () => navigate('/procedurepages/start')

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
          <SocialButton provider="kakao" onClick={handleLogin} />
          <SocialButton provider="naver" onClick={handleLogin} />
          <SocialButton provider="google" onClick={handleLogin} />
        </div>
      </div>

      <HomeIndicator />
    </MobileScreen>
  )
}
