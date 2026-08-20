import { useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { previewRoutine } from '../api/reports'
import type { ReportProductCard, ReportResponse, ReportRoutineStep } from '../api/reports'
import Navigator from '../components/Navigator'
import { reconcileProducts } from '../lib/dDay'
import { getLastReport } from '../lib/procedureStore'
import { SKIN_TYPE_FACE_ICON } from '../procedurepages/skinTypeData'
import type { SkinType } from '../procedurepages/skinTypeData'
import { SKIN_TYPE_REPORT_COPY } from './reportData'

const SKIN_TYPE_CODE_TO_LOCAL: Record<ReportResponse['skinType']['code'], SkinType> = {
  DRY: 'dry',
  NORMAL: 'normal',
  OILY: 'oily',
  COMBINATION: 'combination',
  UNKNOWN: 'normal',
}

interface ReportLocationState {
  report?: ReportResponse
}

/** Figma `정상/비정상 피부 보고서` (node 882:7212 / 7457 / 7797 / 8030 / 8234) */
export default function ReportPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as ReportLocationState | null
  const report = state?.report ?? getLastReport()

  const [procedureOpen, setProcedureOpen] = useState(true)
  const [usableOpen, setUsableOpen] = useState(true)
  const [restrictedOpen, setRestrictedOpen] = useState(true)
  const [evidenceOpen, setEvidenceOpen] = useState(true)
  const [previewSteps, setPreviewSteps] = useState<ReportRoutineStep[] | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)

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

  const localSkinType = SKIN_TYPE_CODE_TO_LOCAL[report.skinType.code]
  const skinTypeFeatures = SKIN_TYPE_REPORT_COPY[localSkinType]
  const routineReady = report.routine.status === 'READY' || report.routine.status === 'BASIC'
  const routineSteps = routineReady ? report.routine.steps : previewSteps
  const { usable, restricted } = reconcileProducts(
    report.products.usable,
    report.products.restricted,
  )
  const isBasicCare = report.header.status === 'BASIC_CARE'

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
      <div className="flex w-full max-w-[402px] flex-col bg-white">
        <div className="flex flex-1 flex-col gap-[25px] overflow-y-auto px-[25px] pb-[85px] pt-[calc(16px+env(safe-area-inset-top))]">
          <div className="flex w-full flex-col gap-[12px] pb-[15px]">
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-[3px]">
                <p className="text-[10px] leading-normal text-gray-600">
                  {report.asOf.replace(/-/g, '.')} 생성
                </p>
                <p className="break-keep text-[18px] font-bold leading-normal text-gray-950">
                  {report.header.userName}님의 보고서
                </p>
              </div>
              <div className="flex flex-col items-end">
                {report.header.status === 'COUNTDOWN' ? (
                  <>
                    <p className="text-[10px] leading-normal text-gray-600">
                      모든 화장품 해금까지
                    </p>
                    <p className="text-[18px] font-bold leading-normal text-brand">
                      {report.header.dDayLabel}
                    </p>
                  </>
                ) : (
                  <p className="text-[15px] font-semibold leading-normal text-brand">
                    {report.header.line}
                  </p>
                )}
              </div>
            </div>
            <div className="h-px w-full bg-gray-200" />
          </div>

          {report.basicCareAlert ? (
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

          <section className="flex w-full flex-col gap-[10px]">
            <p className="text-[18px] font-bold leading-normal text-gray-950">
              피부타입
            </p>
            <div className="flex w-full items-center gap-[15px] rounded-[10px] bg-brand px-[15px] py-[15px]">
              <img
                src={SKIN_TYPE_FACE_ICON[localSkinType]}
                alt=""
                width={85}
                height={118}
                className="block shrink-0"
                style={{ width: 85, height: 118 }}
              />
              <div className="flex w-full flex-col gap-[8px]">
                <p className="break-keep text-[18px] font-bold leading-normal text-white">
                  {report.skinType.name}
                </p>
                <ul className="flex flex-col gap-[6px]">
                  {skinTypeFeatures.map((line) => (
                    <li
                      key={line}
                      className="flex gap-[4px] text-[11px] leading-normal text-white"
                    >
                      <span aria-hidden>•</span>
                      <span className="break-keep">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <CollapsibleSection
            title="시술 목록"
            open={procedureOpen}
            onToggle={() => setProcedureOpen((prev) => !prev)}
          >
            {report.treatments.length === 0 ? (
              <EmptyRow text="등록된 시술이 없어요" />
            ) : (
              <div className="flex w-full flex-col gap-[10px]">
                {report.treatments.map((entry, index) => (
                  <div
                    key={index}
                    className="flex h-[60px] w-full items-center justify-between rounded-[10px] border border-gray-200 bg-white px-[16px]"
                  >
                    <div className="flex flex-col gap-[1px]">
                      <p className="text-[15px] font-semibold leading-normal text-gray-950">
                        {entry.name}
                      </p>
                      <p className="text-[10px] leading-normal text-gray-700">
                        {entry.treatedOn.replace(/-/g, '.')}
                      </p>
                    </div>
                    <span
                      className={[
                        'text-[13px] font-medium leading-normal',
                        entry.reaction === 'IRRITATED'
                          ? 'text-[#e64240]'
                          : 'text-brand',
                      ].join(' ')}
                    >
                      {entry.reactionName}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CollapsibleSection>

          {isBasicCare ? null : (
            <>
              <CollapsibleSection
                title="사용 가능한 화장품"
                open={usableOpen}
                onToggle={() => setUsableOpen((prev) => !prev)}
              >
                {usable.length === 0 ? (
                  <EmptyRow text="사용 가능한 화장품이 없어요" />
                ) : (
                  <div className="flex w-full flex-col gap-[10px]">
                    {usable.map((item, index) => (
                      <UsableProductCard key={index} item={item} />
                    ))}
                  </div>
                )}
              </CollapsibleSection>

              <CollapsibleSection
                title="사용 불가능한 화장품"
                open={restrictedOpen}
                onToggle={() => setRestrictedOpen((prev) => !prev)}
              >
                {restricted.length === 0 ? (
                  <EmptyRow
                    text={report.products.allUnlockedLine || '모든 화장품이 해금되었어요'}
                  />
                ) : (
                  <div className="flex w-full flex-col gap-[10px]">
                    {restricted.map((item, index) => (
                      <RestrictedProductCard key={index} item={item} />
                    ))}
                  </div>
                )}
              </CollapsibleSection>
            </>
          )}

          <section className="flex w-full flex-col gap-[10px]">
            <p className="text-[18px] font-bold leading-normal text-gray-950">
              세안 후 루틴
            </p>
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
                      {step.tip ? (
                        <p className="text-[10px] leading-normal text-brand">
                          {step.tip}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative flex h-[230px] w-full items-center justify-center overflow-hidden rounded-[10px] border border-gray-200 bg-white">
                <p className="whitespace-pre-line text-center text-[15px] font-semibold leading-normal text-gray-500">
                  {report.routine.lockNotice ??
                    '모든 화장품 해금 후\n확인 할 수 있어요'}
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

          <div className="h-px w-full bg-gray-200" />

          <CollapsibleSection
            title="근거 논문"
            titleClassName="text-[15px] font-semibold"
            open={evidenceOpen}
            onToggle={() => setEvidenceOpen((prev) => !prev)}
          >
            <div className="flex w-full flex-col gap-[10px]">
              {report.evidencePapers.map((paper) => (
                <div
                  key={paper.id}
                  className="flex w-full flex-col gap-[5px] rounded-[10px] border border-gray-200 bg-white px-[16px] py-[10px]"
                >
                  <p className="text-[13px] font-medium leading-normal text-gray-950">
                    {paper.titleEn}
                  </p>
                  <p className="text-[10px] leading-normal text-gray-500">
                    {paper.summary}
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          <p className="text-[10px] leading-normal text-gray-400">
            {report.disclaimer}
          </p>
        </div>

        <Navigator />
      </div>
    </div>
  )
}

function UsableProductCard({ item }: { item: ReportProductCard }) {
  return (
    <div className="flex w-full flex-col gap-[5px] rounded-[10px] border border-gray-200 bg-white px-[16px] py-[10px]">
      <p className="text-[10px] leading-normal text-brand">{item.categoryPill}</p>
      <p className="text-[15px] font-semibold leading-normal text-gray-950">
        {item.name}
      </p>
      <p className="text-[10px] leading-normal text-gray-950">
        <span className="text-brand">| </span>
        {item.line}
      </p>
    </div>
  )
}

function RestrictedProductCard({ item }: { item: ReportProductCard }) {
  return (
    <div className="flex w-full items-end justify-between gap-[11px] rounded-[10px] bg-gray-100 px-[16px] py-[10px]">
      <div className="flex flex-col gap-[5px]">
        <p className="text-[10px] leading-normal text-gray-500">{item.categoryPill}</p>
        <p className="text-[15px] font-semibold leading-normal text-gray-950">
          {item.name}
        </p>
        <p className="text-[10px] leading-normal text-gray-700">{item.line}</p>
      </div>
      {item.dDayLabel ? (
        <span className="flex h-[23px] shrink-0 items-center justify-center rounded-[5px] bg-gray-400 px-[10px] text-[13px] font-medium text-white">
          {item.dDayLabel}
        </span>
      ) : null}
    </div>
  )
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div className="flex h-[90px] w-full items-center justify-center rounded-[10px] bg-gray-100">
      <p className="text-[13px] font-medium leading-normal text-gray-500">{text}</p>
    </div>
  )
}

interface CollapsibleSectionProps {
  title: string
  titleClassName?: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}

function CollapsibleSection({
  title,
  titleClassName = 'text-[18px] font-bold',
  open,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <section className="flex w-full flex-col gap-[10px]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between"
      >
        <span className={`leading-normal text-gray-950 ${titleClassName}`}>
          {title}
        </span>
        <span
          className={[
            'text-gray-500 transition-transform',
            open ? '' : 'rotate-180',
          ].join(' ')}
          aria-hidden
        >
          ⌄
        </span>
      </button>
      {open ? children : null}
    </section>
  )
}
