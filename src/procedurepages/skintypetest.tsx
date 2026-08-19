import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import answerYesIcon from '../assets/icons/answer-yes.svg'
import skintypeResultCard from '../assets/icons/skintype-result-card.svg'
import { DownUpText, LeftRightText } from '../components/AnimatedText'
import Button from '../components/Button'
import HomeIndicator from '../components/HomeIndicator'
import MobileScreen from '../components/MobileScreen'
import TopAppBar from '../components/TopAppBar'
import {
  getSkinTypeResultMeta,
  nextSkinTypeTestCell,
  SKIN_TYPE_TEST_GRID,
  SKIN_TYPE_TEST_START,
  type SkinType,
  type SkinTypeTestCell,
} from './skinTypeData'

const TOTAL_ROWS = SKIN_TYPE_TEST_GRID.length

/** 답변 카드 등장 애니메이션 (ms) */
const ANSWER_INTRO_DELAY = 300
const ANSWER_INTRO_STAGGER = 120
const ANSWER_INTRO_DURATION = 600

/** Figma `피부타입 자가 진단` (node 726:1189 / 726:1392 / 726:1485) */
export default function SkinTypeTestPage() {
  const navigate = useNavigate()
  const [cell, setCell] = useState<SkinTypeTestCell>(SKIN_TYPE_TEST_START)
  const [history, setHistory] = useState<SkinTypeTestCell[]>([])
  const [answer, setAnswer] = useState<boolean | null>(null)
  const [result, setResult] = useState<SkinType | null>(null)

  const isLastRow = cell.row === TOTAL_ROWS - 1
  const progress = ((cell.row + 1) / TOTAL_ROWS) * 100
  const question = SKIN_TYPE_TEST_GRID[cell.row][cell.col]

  const handleBack = () => {
    const previous = history[history.length - 1]
    if (!previous) {
      navigate(-1)
      return
    }
    setHistory((prev) => prev.slice(0, -1))
    setCell(previous)
    setAnswer(null)
  }

  const handleNext = () => {
    if (answer === null) return

    const next = nextSkinTypeTestCell(cell, answer)
    if ('result' in next) {
      setResult(next.result)
      return
    }

    setHistory((prev) => [...prev, cell])
    setCell(next)
    setAnswer(null)
  }

  const handleConfirmResult = () => {
    if (!result) return
    navigate('/procedurepages/skintype', {
      replace: true,
      state: { resultType: result },
    })
  }

  return (
    <MobileScreen>
      <TopAppBar onBack={handleBack} />

      <div className="flex w-full flex-col gap-[35px]">
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex w-full flex-col gap-[30px]">
          <p className="text-[24px] font-bold leading-normal text-black">
            <LeftRightText key={`${cell.row}-${cell.col}`}>
              <span className="text-brand">Q. </span>
              {question}
            </LeftRightText>
          </p>

          <div className="flex w-full items-center justify-center gap-[13px]">
            <DownUpText
              key={`${cell.row}-${cell.col}-yes`}
              delay={ANSWER_INTRO_DELAY}
              duration={ANSWER_INTRO_DURATION}
            >
              <AnswerCard
                label="맞아요"
                active={answer === true}
                onClick={() => setAnswer(true)}
              />
            </DownUpText>
            <DownUpText
              key={`${cell.row}-${cell.col}-no`}
              delay={ANSWER_INTRO_DELAY + ANSWER_INTRO_STAGGER}
              duration={ANSWER_INTRO_DURATION}
            >
              <AnswerCard
                label="아니에요"
                active={answer === false}
                onClick={() => setAnswer(false)}
              />
            </DownUpText>
          </div>
        </div>
      </div>

      <div className="mt-auto w-full pb-[15px]">
        <Button variant="brand" disabled={answer === null} onClick={handleNext}>
          {isLastRow ? '테스트 종료하기' : '다음'}
        </Button>
      </div>

      <HomeIndicator className="h-[25px]" />

      {result ? (
        <SkinTypeResultModal skinType={result} onConfirm={handleConfirmResult} />
      ) : null}
    </MobileScreen>
  )
}

interface AnswerCardProps {
  label: string
  active: boolean
  onClick: () => void
}

/** 맞아요/아니에요 선택 카드 (node 726:1291 / 726:1303) */
function AnswerCard({ label, active, onClick }: AnswerCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'flex h-[200px] w-[170px] flex-col items-center justify-center gap-[10px] rounded-[10px] border pb-[21px] pl-[13px] pr-[14px] pt-[36px]',
        active ? 'border-2 border-brand bg-brand/20' : 'border-gray-200 bg-white',
      ].join(' ')}
    >
      {label === '맞아요' ? (
        <img
          src={answerYesIcon}
          alt=""
          width={64}
          height={64}
          className="block h-[64px] w-[64px]"
        />
      ) : (
        <XMark />
      )}
      <p className="text-[18px] font-bold leading-normal text-black">{label}</p>
    </button>
  )
}

/** Simple Design System `X` 아이콘 (node 174:476) 대체 */
function XMark() {
  return (
    <svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      className="block"
    >
      <path
        d="M12 12L36 36M36 12L12 36"
        stroke="#ef4444"
        strokeWidth={6}
        strokeLinecap="round"
      />
    </svg>
  )
}

interface SkinTypeResultModalProps {
  skinType: SkinType
  onConfirm: () => void
}

/** 진단 결과 안내 모달 (node 899:13797 / 13798 / 13800 / 13801) */
function SkinTypeResultModal({ skinType, onConfirm }: SkinTypeResultModalProps) {
  const meta = getSkinTypeResultMeta(skinType)

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      <div className="relative flex w-full max-w-[402px] items-center justify-center bg-gray-950/50 px-[25px]">
        <div
          className="relative flex w-full max-w-[352px] flex-col items-center gap-[30px] bg-contain bg-center bg-no-repeat px-[28px] py-[18px] shadow-lg"
          style={{ backgroundImage: `url(${skintypeResultCard})` }}
        >
          <div className="flex w-full flex-col items-center gap-[20px]">
            <div className="flex h-[135px] w-[135px] items-center justify-center rounded-full bg-brand/10">
              <img
                src={meta.icon}
                alt=""
                width={meta.iconWidth}
                height={meta.iconHeight}
                className="block"
                style={{ width: meta.iconWidth, height: meta.iconHeight }}
              />
            </div>
            <div className="flex flex-col items-center gap-0 text-center">
              <p className="text-[15px] font-semibold leading-normal text-gray-500">
                {meta.subtitle}
              </p>
              <p className="text-[24px] font-bold leading-normal text-black">
                {meta.label}
              </p>
            </div>
          </div>

          <div className="h-0 w-full border-t border-dashed border-gray-200" />

          <div className="flex w-full flex-col gap-[30px]">
            <div className="flex w-full flex-col gap-[10px]">
              <PercentBar label="수분" percent={meta.moisture} />
              <PercentBar label="유분" percent={meta.oil} />
            </div>

            <div className="flex w-full flex-col gap-[5px]">
              <p className="text-[13px] font-medium leading-normal text-black">
                피부 특징
              </p>
              <div className="flex w-full flex-col gap-[5px] rounded-[10px] bg-gray-100 px-[15px] py-[13px]">
                {meta.features.map((line) => (
                  <p
                    key={line}
                    className="text-[10px] font-medium leading-normal text-black"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <Button variant="brand" onClick={onConfirm}>
            확인
          </Button>
        </div>
      </div>
    </div>
  )
}

interface PercentBarProps {
  label: string
  percent: number
}

/** 수분 · 유분 퍼센트 바 (node 899:13648 계열) */
function PercentBar({ label, percent }: PercentBarProps) {
  return (
    <div className="flex w-full flex-col gap-[17px]">
      <div className="flex w-full items-center justify-between text-[15px] font-semibold leading-normal">
        <span className="text-black">{label}</span>
        <span className="text-brand">{percent}%</span>
      </div>
      <div className="h-[4px] w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-brand"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
