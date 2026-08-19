import checkBrandIcon from '../assets/icons/check-brand.svg'
import type { ProcedureCondition } from '../lib/procedureStore'
import BetaBadge from './BetaBadge'

export interface ProcedureItemProps {
  name: string
  /** 이름 옆에 옅게 붙는 보조 설명 (예: "이마 · 앞광대 · 팔자") */
  detail?: string
  beta?: boolean
  selected?: boolean
  /** 선택된 항목에만 표시되는 시술 날짜 (yyyy.MM.dd) */
  date?: string
  /** 선택된 항목에만 표시되는 시술 부위 상태 */
  condition?: ProcedureCondition
  onToggle?: () => void
}

/**
 * Figma `시술 목록 항목`
 * 기본 (node 399:1268) / 선택 (node 857:3993, 857:4013)
 */
export default function ProcedureItem({
  name,
  detail,
  beta = false,
  selected = false,
  date,
  condition,
  onToggle,
}: ProcedureItemProps) {
  if (selected) {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-pressed
        className="flex h-[70px] w-full shrink-0 items-center justify-between rounded-[10px] border-2 border-brand bg-brand/20 px-[16px] text-left"
      >
        <span className="flex items-center gap-[12px]">
          <img
            src={checkBrandIcon}
            alt=""
            width={15}
            height={15}
            className="block h-[15px] w-[15px] shrink-0"
          />
          <span className="flex flex-col items-start">
            <span className="flex items-baseline gap-[8px]">
              <span className="text-[15px] font-semibold leading-none text-black">
                {name}
              </span>
              {detail ? (
                <span className="text-[13px] font-medium leading-none text-gray-700">
                  {detail}
                </span>
              ) : null}
            </span>
            {date ? (
              <span className="text-[10px] leading-none text-black">{date}</span>
            ) : null}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-[7px]">
          {condition ? (
            <span
              className={[
                'text-[13px] font-medium leading-none',
                condition === 'irritated' ? 'text-[#e64240]' : 'text-brand',
              ].join(' ')}
            >
              시술 부위
            </span>
          ) : null}
          {beta ? <BetaBadge selected /> : null}
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={false}
      className="flex h-[55px] w-full shrink-0 items-center justify-between rounded-[10px] border border-gray-200 bg-white px-[16px] text-left"
    >
      <span className="flex items-center gap-[12px]">
        <span className="block h-[18px] w-[18px] shrink-0 rounded-[9px] border-2 border-gray-200" />
        <span className="flex items-baseline gap-[8px]">
          <span className="text-[15px] font-semibold leading-none text-gray-900">
            {name}
          </span>
          {detail ? (
            <span className="text-[13px] font-medium leading-none text-gray-700">
              {detail}
            </span>
          ) : null}
        </span>
      </span>
      {beta ? <BetaBadge /> : null}
    </button>
  )
}
