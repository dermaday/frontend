import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CosmeticResponse } from '../api/cosmetics'
import { listCosmeticsByTreatment } from '../api/cosmetics'
import { getDownloadUrl } from '../api/images'
import { previewRoutine } from '../api/reports'
import type { ReportProductCard, ReportResponse, ReportRoutineStep } from '../api/reports'
import { listTreatments } from '../api/treatments'
import type { TreatmentResponse } from '../api/treatments'
import Navigator from '../components/Navigator'
import SideMenu from '../components/SideMenu'
import { daysSince, reconcileProducts } from '../lib/dDay'
import { getLastReport } from '../lib/procedureStore'
import {
  GENERAL_COSMETIC_IMAGE,
  getProductTypeDefaultImage,
} from '../procedurepages/procedureData'

interface CosmeticImageInfo {
  imageUrl?: string
  productType: CosmeticResponse['productType']
}

/**
 * Figma `메인홈` (node 973:4447 해금 전 / 973:4581 루틴 미리 해금 / 973:4703 해금 완료 / 973:4803 비정상 피부)
 * 네 가지 상태 모두 report.tsx와 같은 캐시된 리포트(getLastReport) 하나로 표현한다 —
 * 리포트를 다시 조회하는 GET 엔드포인트가 없어서다.
 */
export default function HomePage() {
  const navigate = useNavigate()
  const [report, setReport] = useState<ReportResponse | null>(() => getLastReport())
  const [imagesByName, setImagesByName] = useState<Record<string, CosmeticImageInfo>>({})
  const [treatmentRecords, setTreatmentRecords] = useState<TreatmentResponse[]>([])
  const [activeTreatmentId, setActiveTreatmentId] = useState<number>()
  const [menuOpen, setMenuOpen] = useState(false)
  const [restrictedOpen, setRestrictedOpen] = useState(true)
  const [previewSteps, setPreviewSteps] = useState<ReportRoutineStep[] | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)

  // 화장품 이미지는 리포트에 안 들어있어서(ProductCard엔 imageObjectKey가 없음) 등록된 화장품 목록에서 이름으로 매칭한다
  // 시술 목록은 사이드 메뉴에서 지난 시술별 리포트를 다시 불러올 때도 쓴다
  useEffect(() => {
    let ignore = false

    async function loadImages() {
      try {
        const treatments = await listTreatments()
        if (!ignore) {
          setTreatmentRecords(treatments)
          // 배열 순서(마지막 = 최신)에 기대지 않고 id가 가장 큰 기록을 기본 선택으로 삼는다
          const latestId = treatments.reduce<number | undefined>(
            (latest, entry) => (latest === undefined || entry.id > latest ? entry.id : latest),
            undefined,
          )
          setActiveTreatmentId((prev) => prev ?? latestId)
        }
        const lists = await Promise.all(
          treatments.map((treatment) => listCosmeticsByTreatment(treatment.id)),
        )
        const cosmetics = lists.flat()

        const entries = await Promise.all(
          cosmetics.map(async (cosmetic): Promise<[string, CosmeticImageInfo]> => {
            if (!cosmetic.imageObjectKey) {
              return [cosmetic.name, { productType: cosmetic.productType }]
            }
            try {
              const imageUrl = await getDownloadUrl(cosmetic.imageObjectKey)
              return [cosmetic.name, { imageUrl, productType: cosmetic.productType }]
            } catch {
              return [cosmetic.name, { productType: cosmetic.productType }]
            }
          }),
        )

        if (!ignore) setImagesByName(Object.fromEntries(entries))
      } catch {
        // 이미지 매칭에 실패해도 기본 이미지로 대체되므로 조용히 무시한다
      }
    }

    void loadImages()
    return () => {
      ignore = true
    }
  }, [])

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

  const { usable, restricted } = reconcileProducts(
    report.products.usable,
    report.products.restricted,
  )
  const isBasicCare = report.header.status === 'BASIC_CARE'
  const showHeroBanner = !isBasicCare && restricted.length > 0
  const bannerProduct = showHeroBanner
    ? restricted.reduce((max, item) => ((item.daysLeft ?? 0) > (max.daysLeft ?? 0) ? item : max))
    : null

  const earliestTreatedOn = report.treatments.reduce<string | null>(
    (earliest, entry) => (!earliest || entry.treatedOn < earliest ? entry.treatedOn : earliest),
    null,
  )
  const elapsedDays = earliestTreatedOn ? daysSince(earliestTreatedOn) : 0

  const routineReady = report.routine.status === 'READY' || report.routine.status === 'BASIC'
  const routineSteps = routineReady ? report.routine.steps : previewSteps

  const handlePreviewRoutine = async () => {
    if (previewLoading) return
    setPreviewLoading(true)
    try {
      const preview = await previewRoutine(report.reportId)
      setPreviewSteps(preview.steps)
    } catch {
      // 실패해도 잠금 화면을 유지한다
    } finally {
      setPreviewLoading(false)
    }
  }

  return (
    <div className="flex min-h-[100dvh] justify-center">
      <SideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        treatments={treatmentRecords}
        activeTreatmentId={activeTreatmentId}
        onSelectReport={(nextReport, treatmentId) => {
          setReport(nextReport)
          setActiveTreatmentId(treatmentId)
        }}
      />
      <div className="flex w-full max-w-[402px] flex-col bg-white">
        <div className="flex flex-1 flex-col gap-[25px] overflow-y-auto px-[25px] pb-[85px] pt-[calc(16px+env(safe-area-inset-top))]">
          <HomeHeader
            userName={report.header.userName}
            elapsedDays={elapsedDays}
            onMenuClick={() => setMenuOpen(true)}
          />

          {isBasicCare && report.basicCareAlert ? (
            <div className="flex w-full flex-col gap-[5px] rounded-[10px] bg-[#e64240]/20 px-[18px] py-[17px]">
              <p className="text-[15px] font-semibold leading-normal text-gray-950">
                ⚠️ {report.basicCareAlert.title}
              </p>
              <p className="text-[10px] leading-normal text-gray-700">
                {report.basicCareAlert.body}
                {report.basicCareAlert.riskGroups.length > 0 ? (
                  <>
                    <br />
                    <span className="text-[#e64240]">
                      {report.basicCareAlert.riskGroups.join(' / ')}
                    </span>{' '}
                    성분이 포함된 화장품은 사용할 수 없어요
                  </>
                ) : null}
              </p>
            </div>
          ) : null}

          {showHeroBanner && bannerProduct ? (
            <HeroBanner product={bannerProduct} line={report.header.line} />
          ) : null}

          <section className="flex w-full flex-col gap-[10px]">
            <p className="text-[15px] font-semibold leading-normal text-black">시술 목록</p>
            {report.treatments.length === 0 ? (
              <EmptyBox text="등록된 시술이 없어요" />
            ) : (
              <div className="grid w-full grid-cols-2 gap-[10px]">
                {report.treatments.map((entry, index) => (
                  <TreatmentMiniCard key={index} entry={entry} />
                ))}
              </div>
            )}
          </section>

          {isBasicCare ? null : (
            <>
              <section className="flex w-full flex-col gap-[10px]">
                <p className="text-[18px] font-bold leading-normal text-gray-950">
                  사용 가능한 화장품
                </p>
                {usable.length === 0 ? (
                  <EmptyBox text="사용 가능한 화장품이 없어요" />
                ) : (
                  <div className="flex w-full gap-[10px] overflow-x-auto pb-[4px]">
                    {usable.map((item, index) => (
                      <UsableCosmeticCard
                        key={index}
                        item={item}
                        image={imagesByName[item.name]}
                      />
                    ))}
                  </div>
                )}
              </section>

              <section className="flex w-full flex-col gap-[10px]">
                <button
                  type="button"
                  onClick={() => setRestrictedOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between"
                >
                  <span className="text-[18px] font-bold leading-normal text-gray-950">
                    사용 불가능한 화장품
                  </span>
                  {restricted.length > 0 ? (
                    <ChevronDownIcon className={restrictedOpen ? '' : 'rotate-180'} />
                  ) : null}
                </button>
                {restrictedOpen ? (
                  restricted.length === 0 ? (
                    <EmptyBox
                      text={report.products.allUnlockedLine || '모든 화장품이 해금되었어요'}
                    />
                  ) : (
                    <div className="flex w-full flex-col gap-[10px]">
                      {restricted.map((item, index) => (
                        <RestrictedCosmeticRow key={index} item={item} />
                      ))}
                    </div>
                  )
                ) : null}
              </section>
            </>
          )}

          <section className="flex w-full flex-col gap-[10px]">
            <p className="text-[18px] font-bold leading-normal text-gray-950">세안 후 루틴</p>
            {routineSteps && routineSteps.length > 0 ? (
              <div className="flex w-full flex-col gap-[20px] rounded-[10px] border border-gray-200 bg-white px-[27px] py-[19px]">
                {report.routine.referenceNote ? (
                  <p className="text-[10px] leading-normal text-gray-500">
                    {report.routine.referenceNote}
                  </p>
                ) : null}
                {routineSteps.map((step) => (
                  <div key={step.order} className="flex items-center gap-[25px]">
                    <span
                      className={[
                        'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[9px] text-[13px] font-medium text-white',
                        step.order === 1 ? 'bg-brand' : 'bg-gray-200',
                      ].join(' ')}
                    >
                      {step.order}
                    </span>
                    <div className="flex flex-col gap-[3px]">
                      <p className="text-[15px] font-semibold leading-normal text-gray-950">
                        {step.productName}
                      </p>
                      <p className="text-[10px] leading-normal text-gray-500">
                        {step.categoryPill}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative flex h-[230px] w-full flex-col items-center justify-center gap-[9px] overflow-hidden rounded-[10px] border border-gray-200 bg-white">
                <LockIcon />
                <p className="whitespace-pre-line text-center text-[15px] font-semibold leading-normal text-gray-500">
                  {report.routine.lockNotice ?? '모든 화장품 해금 후\n확인 할 수 있어요'}
                </p>
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
          </section>
        </div>

        <Navigator />
      </div>
    </div>
  )
}

function HomeHeader({
  userName,
  elapsedDays,
  onMenuClick,
}: {
  userName: string
  elapsedDays: number
  onMenuClick: () => void
}) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-[15px]">
        <button type="button" onClick={onMenuClick} aria-label="메뉴 열기">
          <MenuIcon />
        </button>
        <BellIcon />
      </div>
      <div className="flex flex-col items-end text-right">
        <p className="text-[10px] leading-normal text-gray-600">
          {userName}님이 시술을 받으신지
        </p>
        <p className="text-[24px] font-bold leading-normal text-brand">D+{elapsedDays}</p>
      </div>
    </div>
  )
}

function HeroBanner({ product, line }: { product: ReportProductCard; line: string }) {
  return (
    <div className="relative flex h-[150px] w-full flex-col justify-end overflow-hidden rounded-[10px] bg-gradient-to-br from-gray-700 to-gray-950 p-[18px]">
      <div className="flex flex-col gap-[10px]">
        <p className="text-[15px] font-semibold leading-normal text-brand">{product.dDayLabel}</p>
        <div className="flex flex-col">
          <p className="text-[18px] font-bold leading-normal text-white">
            {line || '오늘은 사용을 피해주세요!'}
          </p>
          <p className="text-[13px] font-medium leading-normal text-gray-200">
            {product.name} · {product.categoryPill}
          </p>
        </div>
      </div>
    </div>
  )
}

function TreatmentMiniCard({ entry }: { entry: ReportResponse['treatments'][number] }) {
  return (
    <div className="flex h-[60px] w-full items-center justify-between rounded-[10px] border border-gray-200 bg-white px-[15px]">
      <div className="flex flex-col gap-px">
        <p className="text-[15px] font-semibold leading-normal text-gray-950">{entry.name}</p>
        <p className="text-[10px] leading-normal text-gray-700">
          {entry.treatedOn.replace(/-/g, '.')}
        </p>
      </div>
      <ReactionBadge reaction={entry.reaction} />
    </div>
  )
}

function ReactionBadge({ reaction }: { reaction: 'COMFORTABLE' | 'IRRITATED' }) {
  const comfortable = reaction === 'COMFORTABLE'
  return (
    <span
      aria-hidden
      className={[
        'flex size-[15px] shrink-0 items-center justify-center rounded-full',
        comfortable ? 'bg-brand' : 'bg-[#e64240]',
      ].join(' ')}
    >
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
        {comfortable ? (
          <path
            d="M1.5 4.5L3.5 6.5L7.5 2.5"
            stroke="white"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path d="M2 2L7 7M7 2L2 7" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
        )}
      </svg>
    </span>
  )
}

function UsableCosmeticCard({
  item,
  image,
}: {
  item: ReportProductCard
  image?: CosmeticImageInfo
}) {
  const imageSrc =
    image?.imageUrl ??
    (image?.productType ? getProductTypeDefaultImage(image.productType) : GENERAL_COSMETIC_IMAGE)

  return (
    <div className="flex w-[123px] shrink-0 flex-col gap-[8px] pb-[8px]">
      <img
        src={imageSrc}
        alt=""
        width={123}
        height={123}
        className="block size-[123px] rounded-[10px] object-cover"
      />
      <div className="flex flex-col gap-[2px]">
        <p className="text-[15px] font-semibold leading-normal text-black">{item.name}</p>
        <p className="text-[10px] leading-normal text-gray-400">{item.categoryPill}</p>
      </div>
    </div>
  )
}

function RestrictedCosmeticRow({ item }: { item: ReportProductCard }) {
  return (
    <div className="flex w-full items-center justify-between gap-[11px] rounded-[10px] bg-gray-100 px-[16px] py-[10px]">
      <div className="flex flex-col gap-[5px]">
        <p className="text-[15px] font-semibold leading-normal text-gray-950">{item.name}</p>
        <p className="text-[10px] leading-normal text-gray-700">{item.line}</p>
      </div>
      {item.dDayLabel ? (
        <span className="shrink-0 text-[15px] font-semibold leading-normal text-gray-950">
          {item.dDayLabel}
        </span>
      ) : null}
    </div>
  )
}

function EmptyBox({ text }: { text: string }) {
  return (
    <div className="flex h-[90px] w-full items-center justify-center rounded-[10px] bg-gray-100">
      <p className="text-[13px] font-medium leading-normal text-gray-500">{text}</p>
    </div>
  )
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7H20M4 12H20M4 17H20" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 4C9.23858 4 7 6.23858 7 9V12.5L5.5 15.5H18.5L17 12.5V9C17 6.23858 14.7614 4 12 4Z"
        stroke="#0A0A0A"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 18C10 19.1046 10.8954 20 12 20C13.1046 20 14 19.1046 14 18"
        stroke="#0A0A0A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ChevronDownIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={['transition-transform', className].join(' ')}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="#737373"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="33" height="40" viewBox="0 0 33 40" fill="none" aria-hidden className="opacity-40">
      <rect x="3" y="17" width="27" height="20" rx="4" stroke="#737373" strokeWidth="2" />
      <path
        d="M9 17V11C9 6.58172 12.5817 3 17 3C21.4183 3 25 6.58172 25 11V17"
        stroke="#737373"
        strokeWidth="2"
      />
    </svg>
  )
}
