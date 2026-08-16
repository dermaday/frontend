import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import chevronLeftIcon from '../assets/icons/chevron-left.svg'
import BottomActionBar from '../components/BottomActionBar'
import Button from '../components/Button'
import HomeIndicator from '../components/HomeIndicator'
import MobileScreen from '../components/MobileScreen'
import TopAppBar from '../components/TopAppBar'
import { SKIN_TYPE_META, type SkinType } from './skinTypeData'

interface SkinTypeLocationState {
  resultType?: SkinType
}

/** Figma `어떤 피부타입인가요?` (node 696:1074 / 700:1456) */
export default function SkinTypePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as SkinTypeLocationState | null

  const [selected, setSelected] = useState<SkinType | null>(
    state?.resultType ?? null,
  )

  const handleSubmit = () => {
    if (!selected) return
    // TODO: 백엔드 연동 — 선택한 피부타입을 서버로 전송한다.
    // await api.post('/skin-type', { skinType: selected })
    navigate('/procedurepages/choice')
  }

  return (
    <MobileScreen>
      <TopAppBar onBack={() => navigate(-1)} />

      <h1 className="w-full text-[24px] font-bold leading-normal text-black">
        어떤 피부타입인가요?
      </h1>

      <div className="flex w-full flex-col gap-[15px]">
        <div className="grid grid-cols-2 gap-[13px]">
          {SKIN_TYPE_META.map((meta) => {
            const active = selected === meta.id
            return (
              <button
                key={meta.id}
                type="button"
                onClick={() => setSelected(meta.id)}
                aria-pressed={active}
                className={[
                  'flex h-[220px] w-full flex-col items-center justify-center gap-[15px] rounded-[10px] border pb-[21px] pl-[13px] pr-[14px] pt-[36px]',
                  active
                    ? 'border-2 border-brand bg-brand/20'
                    : 'border-gray-200 bg-white',
                ].join(' ')}
              >
                <img
                  src={meta.icon}
                  alt=""
                  width={meta.iconWidth}
                  height={meta.iconHeight}
                  className="block"
                  style={{ width: meta.iconWidth, height: meta.iconHeight }}
                />
                <div className="flex flex-col items-center gap-[5px] text-center">
                  <p className="text-[18px] font-bold leading-normal text-gray-950">
                    {meta.label}
                  </p>
                  <p className="whitespace-pre-line text-[13px] font-medium leading-normal text-gray-500">
                    {meta.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => navigate('/procedurepages/skintype/test')}
          className="flex h-[90px] w-full items-center justify-between rounded-[10px] border border-gray-200 bg-white px-[16px]"
        >
          <div className="flex flex-col items-start gap-[5px] text-left">
            <p className="text-[15px] font-semibold leading-normal text-gray-950">
              내 피부 타입을 모르겠어요
            </p>
            <p className="text-[10px] font-normal leading-normal text-gray-500">
              피부타입 자기 진단 테스트하러 가기
            </p>
          </div>
          <img
            src={chevronLeftIcon}
            alt=""
            width={20}
            height={20}
            className="block h-[20px] w-[20px] -scale-x-100"
          />
        </button>
      </div>

      <BottomActionBar>
        <Button variant="brand" disabled={!selected} onClick={handleSubmit}>
          선택 완료
        </Button>
      </BottomActionBar>

      <HomeIndicator className="h-[25px]" />
    </MobileScreen>
  )
}
