import type { ReactNode } from 'react'

export interface BottomActionBarProps {
  children: ReactNode
}

/**
 * Figma `선택 완료 버튼` 영역 (node 399:1382)
 * 목록 위에 떠 있고, 위쪽은 흰색으로 페이드된다.
 */
export default function BottomActionBar({ children }: BottomActionBarProps) {
  return (
    <div className="sticky bottom-0 z-10 -mx-[25px] mt-auto w-[calc(100%+50px)] bg-gradient-to-b from-transparent via-white to-white px-[25px] pb-[15px] pt-[50px]">
      {children}
    </div>
  )
}
