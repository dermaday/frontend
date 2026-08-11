import type { ReactNode } from 'react'
import chevronLeftIcon from '../assets/icons/chevron-left.svg'

export interface TopAppBarProps {
  onBack?: () => void
  /** 오른쪽 끝에 붙는 액션 (예: 건너뛰기) */
  right?: ReactNode
}

/**
 * Figma `상단 앱바` (node 5:3078, 399:1893)
 * OS 상태바(시간 · 와이파이 · 배터리)는 생략한다 (AGENTS.md 3).
 * 상단 여백은 MobileScreen의 safe-area padding이 담당한다.
 */
export default function TopAppBar({ onBack, right }: TopAppBarProps) {
  return (
    <div className="flex w-full shrink-0 items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        aria-label="뒤로 가기"
        className="flex h-[33px] w-[33px] items-center justify-center"
      >
        <img
          src={chevronLeftIcon}
          alt=""
          width={33}
          height={33}
          className="block h-[33px] w-[33px]"
        />
      </button>
      {right}
    </div>
  )
}
