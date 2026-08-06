import type { ReactNode } from 'react'

export interface MobileScreenProps {
  children: ReactNode
}

/**
 * 모바일 프레임 (시안 기준 402 x 874, 좌우 25px 패딩 → 콘텐츠 폭 352px)
 * - 402px 미만: 화면 폭에 맞춰 늘어남
 * - 402px 이상: 402px로 고정하고 가운데 정렬
 * - 노치/홈바 영역은 safe-area-inset 으로 보정
 */
export default function MobileScreen({ children }: MobileScreenProps) {
  return (
    <div className="flex min-h-[100dvh] justify-center">
      <div
        className={[
          'flex w-full max-w-[402px] flex-col items-start gap-[25px] bg-white',
          'px-[25px] pt-[calc(16px+env(safe-area-inset-top))]',
          'pb-[env(safe-area-inset-bottom)]',
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  )
}
