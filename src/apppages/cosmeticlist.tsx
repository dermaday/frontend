import Navigator from '../components/Navigator'

/** 디자인 미정 — 준비 중 placeholder */
export default function CosmeticListPage() {
  return (
    <div className="flex min-h-[100dvh] justify-center">
      <div className="flex w-full max-w-[402px] flex-col bg-white">
        <div className="flex flex-1 flex-col items-center justify-center gap-[10px] px-[25px]">
          <p className="text-[18px] font-bold leading-normal text-gray-950">
            화장품
          </p>
          <p className="text-[13px] font-medium leading-normal text-gray-500">
            준비 중이에요
          </p>
        </div>
        <Navigator />
      </div>
    </div>
  )
}
