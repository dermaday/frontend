import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { previewWhs } from '../api/whs'
import HomeIndicator from '../components/HomeIndicator'
import MobileScreen from '../components/MobileScreen'
import TopAppBar from '../components/TopAppBar'

const STEPS = ['WHS에\n연결중이에요', '근거 논문을\n불러오고 있어요'] as const

/** 한 문구가 유지되는 시간 (ms) */
const STEP_INTERVAL = 1800
const OUT_DURATION = 240
const HOLD_DURATION = STEP_INTERVAL - OUT_DURATION

/** Figma `WHS 정보 불러오기 - 로딩` (node 899:10414) */
export default function WhsLoadingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    previewWhs()
      .then((data) => {
        if (ignore) return
        navigate('/procedurepages/whs/result', { replace: true, state: { data } })
      })
      .catch(() => {
        if (!ignore) setError('WHS 정보를 불러오지 못했어요. 다시 시도해주세요.')
      })

    return () => {
      ignore = true
    }
  }, [navigate])

  useEffect(() => {
    if (error) return
    const timer = window.setTimeout(() => setLeaving(true), HOLD_DURATION)
    return () => window.clearTimeout(timer)
  }, [step, error])

  useEffect(() => {
    if (!leaving) return
    const timer = window.setTimeout(() => {
      setStep((prev) => (prev + 1) % STEPS.length)
      setLeaving(false)
    }, OUT_DURATION)
    return () => window.clearTimeout(timer)
  }, [leaving])

  const [firstLine, secondLine] = STEPS[step].split('\n')

  return (
    <MobileScreen>
      <TopAppBar onBack={() => navigate(-1)} />

      {error ? (
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-[16px]">
          <p className="text-center text-[16px] font-semibold text-gray-700">
            {error}
          </p>
          <button
            type="button"
            className="text-[14px] font-semibold text-brand underline"
            onClick={() => navigate(-1)}
          >
            돌아가기
          </button>
        </div>
      ) : (
        <div className="flex w-full flex-1 flex-col items-center justify-center pb-[24px]">
          <WhsLoadingIcon />

          <p
            key={step}
            aria-live="polite"
            className={[
              'mt-[24px] text-center text-[24px] font-bold leading-normal text-black',
              leaving ? 'animate-step-out' : 'animate-step-in',
              'motion-reduce:animate-none',
            ].join(' ')}
          >
            {firstLine}
            <br />
            {secondLine}
          </p>
        </div>
      )}

      <HomeIndicator className="h-[25px]" />
    </MobileScreen>
  )
}

/** Lottie 애니메이션 자리를 대체하는 CSS 막대 애니메이션 */
function WhsLoadingIcon() {
  const bars = [60, 90, 50, 75]

  return (
    <div
      role="progressbar"
      aria-label="WHS 정보 불러오는 중"
      className="flex h-[176px] w-[176px] items-center justify-center rounded-[20px] bg-brand/10"
    >
      <div className="flex w-[80px] flex-col gap-[10px]">
        {bars.map((width, index) => (
          <span
            key={index}
            className="block h-[8px] origin-left animate-bar-grow rounded-full bg-brand motion-reduce:animate-none"
            style={{ width: `${width}%`, animationDelay: `${index * 150}ms` }}
          />
        ))}
        <span className="mt-[4px] block h-[2px] w-full rounded-full bg-brand" />
      </div>
    </div>
  )
}
