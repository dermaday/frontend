import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { previewRoutine } from '../api/reports'
import type { ReportRoutineStep } from '../api/reports'
import routineLockIcon from '../assets/icons/routine-lock.png'
import Navigator from '../components/Navigator'
import TopAppBar from '../components/TopAppBar'
import { getLastReport } from '../lib/procedureStore'

/** Figma `루틴` (node 899:9749) */
export default function RoutinePage() {
  const navigate = useNavigate()
  const [report] = useState(() => getLastReport())
  const [previewSteps, setPreviewSteps] = useState<ReportRoutineStep[] | null>(null)
  const [previewNotice, setPreviewNotice] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)

  if (!report) {
    return (
      <div className="flex min-h-[100dvh] justify-center">
        <div className="flex w-full max-w-[402px] flex-col bg-white">
          <div className="flex flex-1 flex-col items-center justify-center gap-[10px] px-[25px]">
            <p className="text-[15px] font-medium leading-normal text-gray-500">
              아직 생성된 리포트가 없어요
            </p>
            <button
              type="button"
              className="text-[14px] font-semibold text-brand underline"
              onClick={() => navigate('/procedurepages/start')}
            >
              시술 등록하러 가기
            </button>
          </div>
          <Navigator />
        </div>
      </div>
    )
  }

  const routineReady = report.routine.status === 'READY' || report.routine.status === 'BASIC'
  const routineSteps = routineReady ? report.routine.steps : previewSteps

  const handlePreviewRoutine = async () => {
    if (previewLoading) return
    setPreviewLoading(true)
    setPreviewError(null)
    try {
      const preview = await previewRoutine(report.reportId)
      setPreviewSteps(preview.steps)
      setPreviewNotice(preview.notice ?? '해금이 끝나면 추천 루틴을 보여드릴게요')
    } catch (error) {
      console.error('루틴 미리보기 실패', error)
      setPreviewError('루틴을 불러오지 못했어요. 다시 시도해주세요.')
    } finally {
      setPreviewLoading(false)
    }
  }

  return (
    <div className="flex min-h-[100dvh] justify-center">
      <div className="flex w-full max-w-[402px] flex-col bg-white">
        <div className="flex flex-1 flex-col gap-[25px] overflow-y-auto px-[25px] pb-[85px] pt-[calc(16px+env(safe-area-inset-top))]">
          <div className="flex w-full flex-col gap-[12px]">
            <TopAppBar onBack={() => navigate(-1)} />
            <h1 className="text-[24px] font-bold leading-normal text-black">
              세안 후 루틴
            </h1>
          </div>

          {routineSteps && routineSteps.length > 0 ? (
            <div className="flex w-full flex-col gap-[15px]">
              {report.routine.referenceNote ? (
                <p className="text-[10px] leading-normal text-gray-500">
                  {report.routine.referenceNote}
                </p>
              ) : null}
              {routineSteps.map((step) => (
                <RoutineCard key={step.order} step={step} />
              ))}
            </div>
          ) : previewNotice ? (
            <div className="flex h-[230px] w-full flex-col items-center justify-center gap-[9px] rounded-[10px] border border-gray-200 bg-white">
              <img
                src={routineLockIcon}
                alt=""
                width={33}
                height={41}
                className="block h-[41px] w-[33px]"
              />
              <p className="whitespace-pre-line text-center text-[15px] font-semibold leading-normal text-gray-500">
                {previewNotice}
              </p>
            </div>
          ) : (
            <div className="relative flex h-[230px] w-full flex-col items-center justify-center gap-[9px] overflow-hidden rounded-[10px] border border-gray-200 bg-white">
              <img
                src={routineLockIcon}
                alt=""
                width={33}
                height={41}
                className="block h-[41px] w-[33px]"
              />
              <p className="whitespace-pre-line text-center text-[15px] font-semibold leading-normal text-gray-500">
                {report.routine.lockNotice ?? '모든 화장품 해금 후\n확인 할 수 있어요'}
              </p>
              {previewError ? (
                <p className="absolute bottom-[72px] text-center text-[12px] font-medium text-red-500">
                  {previewError}
                </p>
              ) : null}
              <button
                type="button"
                onClick={handlePreviewRoutine}
                disabled={previewLoading}
                className="absolute bottom-[20px] flex h-[45px] w-[280px] items-center justify-center rounded-[10px] bg-brand text-[15px] font-semibold text-white disabled:opacity-60"
              >
                {previewLoading ? '불러오는 중...' : (report.routine.cta ?? '미리 확인하기')}
              </button>
            </div>
          )}
        </div>

        <Navigator />
      </div>
    </div>
  )
}

function RoutineCard({ step }: { step: ReportRoutineStep }) {
  return (
    <div className="flex w-full items-start gap-[15px] rounded-[10px] border border-gray-200 bg-white p-[15px]">
      <span className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[12px] bg-brand text-[13px] font-semibold text-white">
        {step.order}
      </span>
      <div className="flex w-full flex-col gap-[10px]">
        <div className="flex flex-col gap-[3px]">
          <p className="text-[15px] font-semibold leading-normal text-gray-950">
            {step.productName}
          </p>
          <p className="text-[10px] leading-normal text-gray-600">{step.categoryPill}</p>
        </div>

        {step.tags.length > 0 ? (
          <div className="flex flex-wrap items-center gap-[5px]">
            {step.tags.map((tag) => (
              <span
                key={tag}
                className="flex h-[17px] items-center justify-center rounded-[3px] bg-brand/20 px-[8px] text-[10px] leading-none text-brand"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {step.tip ? (
          <div className="flex w-full flex-col items-center gap-[5px]">
            <div className="h-px w-full bg-gray-200" />
            <div className="flex w-full flex-col">
              <p className="text-[8px] leading-normal text-brand">TIP</p>
              <p className="text-[10px] leading-normal text-black">{step.tip}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
