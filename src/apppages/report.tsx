import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import Navigator from '../components/Navigator'
import {
  getSelectedCosmetics,
  getSelectedProcedures,
  getSelectedSkinType,
  hasIrritatedProcedure,
} from '../lib/procedureStore'
import { getSkinTypeMeta } from '../procedurepages/skinTypeData'
import {
  EVIDENCE_PAPERS,
  HIGH_RISK_INGREDIENTS,
  RESTRICTED_COSMETICS,
  ROUTINE_STEPS,
  SKIN_TYPE_REPORT_COPY,
  UNLOCK_DAYS_LEFT,
  USABLE_COSMETICS,
} from './reportData'

const USER_NAME = '염수빈'

/** Figma `정상/비정상 피부 보고서` (node 882:7212 / 7457 / 7797 / 8030 / 8234) */
export default function ReportPage() {
  const procedures = useMemo(() => getSelectedProcedures(), [])
  const cosmetics = useMemo(() => getSelectedCosmetics(), [])
  const skinType = useMemo(() => getSelectedSkinType() ?? 'combination', [])
  const isAbnormal = hasIrritatedProcedure(procedures)

  const [unlocked, setUnlocked] = useState(false)
  const [procedureOpen, setProcedureOpen] = useState(true)
  const [usableOpen, setUsableOpen] = useState(true)
  const [restrictedOpen, setRestrictedOpen] = useState(true)
  const [evidenceOpen, setEvidenceOpen] = useState(true)

  const meta = getSkinTypeMeta(skinType)
  const today = new Date()
  const createdAt = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`

  return (
    <div className="flex min-h-[100dvh] justify-center">
      <div className="flex w-full max-w-[402px] flex-col bg-white">
        <div className="flex flex-1 flex-col gap-[25px] overflow-y-auto px-[25px] pb-[25px] pt-[calc(16px+env(safe-area-inset-top))]">
          <div className="flex w-full flex-col gap-[12px] pb-[15px]">
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-[3px]">
                <p className="text-[10px] leading-normal text-gray-600">
                  {createdAt} 생성
                </p>
                <p className="text-[18px] font-bold leading-normal text-gray-950">
                  {USER_NAME}님의 보고서
                </p>
              </div>
              <div className="flex flex-col items-end">
                {isAbnormal ? (
                  <p className="text-[15px] font-semibold leading-normal text-brand">
                    기본 관리 모드
                  </p>
                ) : (
                  <>
                    <p className="text-[10px] leading-normal text-gray-600">
                      모든 화장품 해금까지
                    </p>
                    <p className="text-[18px] font-bold leading-normal text-brand">
                      {unlocked ? '해금 완료' : `D-${UNLOCK_DAYS_LEFT}`}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="h-px w-full bg-gray-200" />
          </div>

          {isAbnormal ? (
            <div className="flex w-full flex-col gap-[5px] rounded-[10px] bg-[#e64240]/20 px-[18px] py-[17px]">
              <p className="text-[15px] font-semibold leading-normal text-gray-950">
                ⚠️ 지금은 기본관리만 가능해요!
              </p>
              <p className="text-[10px] leading-normal text-gray-700">
                시술한 부위에 문제가 있는 것으로 보여요
                <br />
                등록한 화장품 중{' '}
                <span className="text-[#e64240]">
                  {HIGH_RISK_INGREDIENTS.join(' / ')}
                </span>{' '}
                성분이 포함된 화장품은 사용할 수 없어요
                <br />
                사용 가능한 화장품만 안내해 드릴게요
              </p>
            </div>
          ) : null}

          <section className="flex w-full flex-col gap-[10px]">
            <p className="text-[18px] font-bold leading-normal text-gray-950">
              피부타입
            </p>
            <div className="flex w-full flex-col items-center justify-center gap-[10px] rounded-[10px] bg-brand px-[10px] py-[20px]">
              <div className="flex w-full items-center justify-center gap-[25px]">
                <img
                  src={meta.icon}
                  alt=""
                  width={meta.iconWidth}
                  height={meta.iconHeight}
                  className="block shrink-0 brightness-0 invert"
                  style={{ width: meta.iconWidth, height: meta.iconHeight }}
                />
                <div className="flex w-[217px] flex-col gap-[10px]">
                  <div className="flex flex-col gap-[5px] border-b border-white/40 pb-[5px]">
                    <p className="text-[18px] font-bold leading-normal text-white">
                      {meta.label} 피부
                    </p>
                  </div>
                  <ul className="flex flex-col gap-[5px] text-[10px] leading-normal text-white">
                    {SKIN_TYPE_REPORT_COPY[skinType].map((line) => (
                      <li key={line} className="list-disc pl-[15px]">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <CollapsibleSection
            title="시술 목록"
            open={procedureOpen}
            onToggle={() => setProcedureOpen((prev) => !prev)}
          >
            {procedures.length === 0 ? (
              <EmptyRow text="등록된 시술이 없어요" />
            ) : (
              <div className="flex w-full flex-col gap-[10px]">
                {procedures.map((entry, index) => (
                  <div
                    key={`${entry.id}-${index}`}
                    className="flex h-[60px] w-full items-center justify-between rounded-[10px] border border-gray-200 bg-white px-[16px]"
                  >
                    <div className="flex flex-col gap-[1px]">
                      <p className="text-[15px] font-semibold leading-normal text-gray-950">
                        {entry.name}
                      </p>
                      <p className="text-[10px] leading-normal text-gray-700">
                        {entry.date}
                      </p>
                    </div>
                    <span
                      className={[
                        'text-[13px] font-medium leading-normal',
                        entry.condition === 'irritated'
                          ? 'text-[#e64240]'
                          : 'text-brand',
                      ].join(' ')}
                    >
                      시술 부위
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CollapsibleSection>

          <CollapsibleSection
            title="사용 가능한 화장품"
            open={usableOpen}
            onToggle={() => setUsableOpen((prev) => !prev)}
          >
            <div className="flex w-full flex-col gap-[10px]">
              {USABLE_COSMETICS.map((item) => (
                <div
                  key={item.name}
                  className="flex w-full flex-col gap-[5px] rounded-[10px] border border-gray-200 bg-white px-[16px] py-[10px]"
                >
                  <p className="text-[10px] leading-normal text-brand">
                    {item.category}
                  </p>
                  <p className="text-[15px] font-semibold leading-normal text-gray-950">
                    {item.name}
                  </p>
                  <p className="text-[10px] leading-normal text-gray-950">
                    <span className="text-brand">| </span>
                    {item.note}
                  </p>
                </div>
              ))}
              {cosmetics.length > 0 ? (
                <p className="text-[10px] leading-normal text-gray-500">
                  내가 등록한 화장품: {cosmetics.join(', ')}
                </p>
              ) : null}
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="사용 불가능한 화장품"
            open={restrictedOpen}
            onToggle={() => setRestrictedOpen((prev) => !prev)}
          >
            {unlocked ? (
              <EmptyRow text="모든 화장품이 해금되었어요" />
            ) : (
              <div className="flex w-full flex-col gap-[10px]">
                {RESTRICTED_COSMETICS.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex w-full items-end justify-between gap-[11px] rounded-[10px] bg-gray-100 px-[16px] py-[10px]"
                  >
                    <div className="flex flex-col gap-[5px]">
                      <p className="text-[10px] leading-normal text-gray-500">
                        {item.category}
                      </p>
                      <p className="text-[15px] font-semibold leading-normal text-gray-950">
                        {item.name}
                      </p>
                      <p className="text-[10px] leading-normal text-gray-700">
                        {item.note}
                      </p>
                    </div>
                    <span className="flex h-[23px] shrink-0 items-center justify-center rounded-[5px] bg-gray-400 px-[10px] text-[13px] font-medium text-white">
                      D-{item.daysLeft}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CollapsibleSection>

          <section className="flex w-full flex-col gap-[10px]">
            <p className="text-[18px] font-bold leading-normal text-gray-950">
              세안 후 루틴
            </p>
            {unlocked ? (
              <div className="flex w-full flex-col gap-[20px] rounded-[10px] border border-gray-200 bg-white px-[27px] py-[19px]">
                {ROUTINE_STEPS.map((step) => (
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
                        {step.name}
                      </p>
                      <p className="text-[10px] leading-normal text-gray-500">
                        {step.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative flex h-[230px] w-full items-center justify-center overflow-hidden rounded-[10px] border border-gray-200 bg-white">
                <p className="text-center text-[15px] font-semibold leading-normal text-gray-500">
                  모든 화장품 해금 후
                  <br />
                  확인 할 수 있어요
                </p>
                <button
                  type="button"
                  onClick={() => setUnlocked(true)}
                  className="absolute bottom-[20px] flex h-[45px] w-[280px] items-center justify-center rounded-[10px] bg-brand text-[15px] font-semibold text-white"
                >
                  미리 확인하기
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
              {EVIDENCE_PAPERS.map((paper, index) => (
                <div
                  key={index}
                  className="flex w-full flex-col gap-[5px] rounded-[10px] border border-gray-200 bg-white px-[16px] py-[10px]"
                >
                  <p className="text-[13px] font-medium leading-normal text-gray-950">
                    {paper.title}
                  </p>
                  <p className="text-[10px] leading-normal text-gray-500">
                    {paper.summary}
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </div>

        <Navigator />
      </div>
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
