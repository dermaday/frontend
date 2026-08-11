import { useNavigate } from 'react-router-dom'
import welcomeImage from '../assets/images/welcome.png'
import { DownUpText, LeftRightText } from '../components/AnimatedText'
import Button from '../components/Button'
import HomeIndicator from '../components/HomeIndicator'
import MobileScreen from '../components/MobileScreen'
import TopAppBar from '../components/TopAppBar'

/** Figma `O-01 시술 등록 선택` (node 410:2251) */
export default function ProcedureStartPage() {
  const navigate = useNavigate()

  // TODO: 백엔드 연동 — 로그인한 사용자 이름을 받아 온다.
  const userName = 'OOO'

  return (
    <MobileScreen>
      <TopAppBar onBack={() => navigate(-1)} />

      <div className="mt-[25px] flex w-full flex-col gap-[10px]">
        <h1 className="w-[259px] text-[32px] font-extrabold leading-normal text-black">
          <LeftRightText>환영합니다 {userName}님!</LeftRightText>
        </h1>
        <p className="w-[285px] text-[15px] font-semibold leading-normal text-gray-700">
          <DownUpText>더마데이가 간단한 설문을 준비했습니다</DownUpText>
        </p>
      </div>

      <div className="mt-auto flex w-full flex-col items-center gap-[10px]">
        {/* 시안에서 좌우 반전된 일러스트 */}
        <img
          src={welcomeImage}
          alt=""
          width={324}
          height={216}
          className="block h-[216px] w-[324px] -scale-x-100 object-cover"
        />

        <Button variant="brand" onClick={() => navigate('/procedurepages/choice')}>
          시작하기
        </Button>
        <Button variant="outline" onClick={() => navigate('/procedurepages/choice')}>
          건너뛰기
        </Button>
      </div>

      <HomeIndicator className="h-[50px]" />
    </MobileScreen>
  )
}
