import checkBrandIcon from '../assets/icons/check-brand.svg'
import BetaBadge from './BetaBadge'

export interface ProcedureItemProps {
  name: string
  beta?: boolean
  selected?: boolean
  /** 선택된 항목에만 표시되는 시술 날짜 (yyyy.MM.dd) */
  date?: string
  onToggle?: () => void
}

/**
 * Figma `시술 목록 항목`
 * 기본 (node 399:1268) / 선택 (node 399:1409)
 */
export default function ProcedureItem({
  name,
  beta = false,
  selected = false,
  date,
  onToggle,
}: ProcedureItemProps) {
  if (selected) {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-pressed
        className="flex h-[80px] w-full shrink-0 items-center justify-between rounded-[10px] border-2 border-brand bg-brand/20 pl-[15px] pr-[19px] text-left"
      >
        <span className="flex items-center gap-[19px]">
          <img
            src={checkBrandIcon}
            alt=""
            width={15}
            height={15}
            className="block h-[15px] w-[15px] shrink-0"
          />
          <span className="flex flex-col gap-[3px]">
            <span className="text-[15px] font-semibold leading-none text-black">
              {name}
            </span>
            {date ? (
              <span className="text-[10px] leading-none text-black">{date}</span>
            ) : null}
          </span>
        </span>
        {beta ? <BetaBadge selected /> : null}
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
        <span className="text-[15px] font-semibold leading-none text-gray-900">
          {name}
        </span>
      </span>
      {beta ? <BetaBadge /> : null}
    </button>
  )
}
