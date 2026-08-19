import { useNavigate } from 'react-router-dom'
import routineTimeline from '../assets/icons/routine-timeline.svg'
import Navigator from '../components/Navigator'
import TopAppBar from '../components/TopAppBar'
import { getProductTypeDefaultImage } from '../procedurepages/procedureData'
import { ROUTINE_STEPS } from './reportData'

/** Figma `루틴` (node 899:9749) */
export default function RoutinePage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[100dvh] justify-center">
      <div className="flex w-full max-w-[402px] flex-col bg-white">
        <div className="flex flex-1 flex-col gap-[25px] px-[25px] pb-[25px] pt-[calc(16px+env(safe-area-inset-top))]">
          <div className="flex w-full flex-col gap-[12px]">
            <TopAppBar onBack={() => navigate(-1)} />
            <h1 className="text-[24px] font-bold leading-normal text-black">
              세안 후 루틴
            </h1>
          </div>

          <div className="flex w-full gap-[15px]">
            <img
              src={routineTimeline}
              alt=""
              width={25}
              height={550}
              className="block w-[25px] shrink-0"
            />
            <div className="flex w-full flex-col gap-[30px]">
              {ROUTINE_STEPS.map((step) => (
                <RoutineCard key={step.order} step={step} />
              ))}
            </div>
          </div>
        </div>

        <Navigator />
      </div>
    </div>
  )
}

function RoutineCard({ step }: { step: (typeof ROUTINE_STEPS)[number] }) {
  return (
    <div className="flex h-[115px] w-full items-center justify-center rounded-[10px] border border-gray-200 bg-white">
      <div className="flex w-[260px] flex-col gap-[10px]">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-[3px]">
            <p className="text-[10px] leading-normal text-gray-600">
              {step.category}
            </p>
            <p className="text-[15px] font-semibold leading-normal text-gray-950">
              {step.name}
            </p>
          </div>
          <img
            src={getProductTypeDefaultImage(step.productType)}
            alt=""
            width={33}
            height={33}
            className="block size-[33px] shrink-0 rounded-[10px] object-cover"
          />
        </div>
        <div className="flex w-full flex-col items-center gap-[5px]">
          <div className="h-px w-full bg-gray-200" />
          <div className="flex w-full flex-col">
            <p className="text-[8px] leading-normal text-brand">TIP</p>
            <p className="text-[10px] leading-normal text-black">{step.tip}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
