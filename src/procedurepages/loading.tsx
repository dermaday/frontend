import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createReport } from '../api/reports'
import { listTreatments } from '../api/treatments'
import HomeIndicator from '../components/HomeIndicator'
import MobileScreen from '../components/MobileScreen'
import { saveLastReport } from '../lib/procedureStore'

/**
 * 진행 단계 문구. 시안(node 522:1026)대로 두 줄로 끊는다.
 * 토스 가이드대로 해요체를 쓰고, 실제로 서버에서 일어나는 일을 그대로 적는다.
 */
const STEPS = [
  ['데이터를', '분석하고 있어요'],
  ['근거 논문을', '불러오고 있어요'],
  ['리포트를', '작성하고 있어요'],
  ['루틴을', '만들고 있어요'],
] as const

/** 한 문구가 유지되는 시간 (ms) */
const STEP_INTERVAL = 1800
/** 문구가 위로 빠지는 시간 (ms) — tailwind step-out과 맞춰야 한다 */
const OUT_DURATION = 240
/** 문구가 머무는 시간 = 한 단계 - 빠지는 시간 */
const HOLD_DURATION = STEP_INTERVAL - OUT_DURATION

/** 링 반지름 · 점 최대 지름 (px) */
const RING_RADIUS = 36
const DOT_SIZE = 16
/** 점 개수 */
const DOT_COUNT = 8
/** 한 바퀴 도는 데 걸리는 시간 (ms) — tailwind dot-fade와 맞춰야 한다 */
const SPIN_DURATION = 1200

/** Figma `리포트 생성 로딩 (light)` (node 522:954) */
export default function AnalyzingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 문구는 응답이 올 때까지 계속 순환한다
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

  useEffect(() => {
    let ignore = false

    async function generateReport() {
      try {
        const treatments = await listTreatments()
        const latestTreatment = treatments[treatments.length - 1]
        if (!latestTreatment) {
          throw new Error('등록된 시술 기록이 없어요')
        }

        const report = await createReport({ treatmentRecordId: latestTreatment.id })

        if (ignore) return
        saveLastReport(report)
        navigate('/report', { state: { report } })
      } catch {
        if (!ignore) setError('리포트를 만들지 못했어요. 다시 시도해주세요.')
      }
    }

    void generateReport()

    return () => {
      ignore = true
    }
  }, [navigate])

  const [firstLine, secondLine] = STEPS[step]

  return (
    <MobileScreen>
      {/* 시안상 블록 중심이 화면 중앙보다 12px 위 → pb로 보정 */}
      <div className="flex w-full flex-1 flex-col items-center justify-center pb-[24px]">
        {error ? (
          <div className="flex flex-col items-center gap-[16px]">
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
          <>
            <div
              className="relative h-[150px] w-[150px]"
              role="progressbar"
              aria-label="분석 중"
            >
              {Array.from({ length: DOT_COUNT }, (_, index) => (
                // 자리는 고정. 안쪽 점이 커졌다 작아지면서 큰 점이 돌아가는 것처럼 보인다
                <span
                  key={index}
                  className="absolute left-1/2 top-1/2 block"
                  style={{
                    width: DOT_SIZE,
                    height: DOT_SIZE,
                    marginLeft: -DOT_SIZE / 2,
                    marginTop: -DOT_SIZE / 2,
                    transform: `rotate(${
                      (index * 360) / DOT_COUNT
                    }deg) translateY(-${RING_RADIUS}px)`,
                  }}
                >
                  <span
                    // 로딩 표시는 멈추면 의미가 없으므로 reduce-motion에서도 계속 돈다
                    className="block h-full w-full animate-dot-fade rounded-full bg-brand"
                    style={{
                      animationDelay: `${-(index * SPIN_DURATION) / DOT_COUNT}ms`,
                    }}
                  />
                </span>
              ))}
            </div>

            <p
              // key가 바뀌면 다시 마운트되면서 등장 애니메이션이 재생된다
              key={step}
              aria-live="polite"
              className={[
                'text-center text-[24px] font-bold leading-normal text-black',
                leaving ? 'animate-step-out' : 'animate-step-in',
                'motion-reduce:animate-none',
              ].join(' ')}
            >
              {firstLine}
              <br />
              {secondLine}
            </p>
          </>
        )}
      </div>

      <HomeIndicator className="h-[38px]" />
    </MobileScreen>
  )
}
