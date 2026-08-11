export interface BetaBadgeProps {
  /** 선택된 항목 위에 올라갈 때는 민트 배경 + 흰 글자 */
  selected?: boolean
}

/** Figma `Beta` 배지 (node 399:1284) */
export default function BetaBadge({ selected = false }: BetaBadgeProps) {
  return (
    <span
      className={[
        'flex h-[24px] w-[57px] shrink-0 items-center justify-center rounded-[5px]',
        'text-[13px] font-medium leading-none',
        selected ? 'bg-brand text-white' : 'bg-gray-200 text-gray-600',
      ].join(' ')}
    >
      Beta
    </span>
  )
}
