import { useNavigate } from 'react-router-dom'
import HomeIndicator from '../components/HomeIndicator'
import MobileScreen from '../components/MobileScreen'
import SocialButton from '../components/SocialButton'
import TopAppBar from '../components/TopAppBar'

/** Figma `A-01 로그인` (node 5:3) */
export default function LoginPage() {
  const navigate = useNavigate()

  return (
    <MobileScreen>
      <TopAppBar onBack={() => navigate(-1)} />

      <div className="flex w-full flex-1 flex-col">
        <h1 className="text-[25px] mt-10 font-semibold leading-normal text-black">
          시술의 완성
          <br />
          오늘부터 더마데이가 함께해요!
        </h1>

        <div className="mt-auto flex w-full flex-col gap-[15px]">
          <SocialButton provider="kakao" />
          <SocialButton provider="naver" />
          <SocialButton provider="google" />
        </div>
      </div>

      <HomeIndicator />
    </MobileScreen>
  )
}
