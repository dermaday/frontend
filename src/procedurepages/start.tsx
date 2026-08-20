import { useNavigate } from 'react-router-dom'
import { useAuth } from '../api/AuthContext'
import welcomeImage from '../assets/images/welcome.png'
import { DownUpText, LeftRightText } from '../components/AnimatedText'
import Button from '../components/Button'
import HomeIndicator from '../components/HomeIndicator'
import MobileScreen from '../components/MobileScreen'
import TopAppBar from '../components/TopAppBar'

/** Figma `정보 등록 방법 선택` (node 899:10168) */
export default function ProcedureStartPage() {
  const navigate = useNavigate()
  const { member } = useAuth()

  const userName = member?.displayName ?? 'OOO'

  return (
    <MobileScreen>
      <TopAppBar onBack={() => navigate(-1)} />

      <div className="flex w-full flex-col gap-[10px]">
        <h1 className="w-full break-keep text-[32px] font-extrabold leading-normal text-black">
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

        <Button variant="brand" onClick={() => navigate('/procedurepages/skintype')}>
          시작하기
        </Button>
        <Button variant="outline" onClick={() => navigate('/procedurepages/whs/loading')}>
          WHS 정보 불러오기
        </Button>
      </div>

      <HomeIndicator className="h-[50px]" />
    </MobileScreen>
  )
}
