import { useEffect, useState } from 'react'
import Wordmark from './Wordmark'

/** 로고가 그대로 노출되는 시간 (ms). 뒤 화면의 등장 애니메이션 기준점으로도 쓰인다. */
export const SPLASH_VISIBLE_DURATION = 1200
/** 페이드 아웃에 걸리는 시간 (ms) */
const FADE_DURATION = 600

/**
 * Figma `로딩 페이지` (node 410:2248)
 * 앱 위에 덮이는 오버레이라, 사라질 때 아래 화면이 자연스럽게 비쳐 보인다.
 */
export default function SplashOverlay() {
  const [leaving, setLeaving] = useState(false)
  const [removed, setRemoved] = useState(false)

  useEffect(() => {
    const fadeTimer = window.setTimeout(
      () => setLeaving(true),
      SPLASH_VISIBLE_DURATION,
    )
    const removeTimer = window.setTimeout(
      () => setRemoved(true),
      SPLASH_VISIBLE_DURATION + FADE_DURATION,
    )

    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(removeTimer)
    }
  }, [])

  if (removed) return null

  return (
    <div
      aria-hidden={leaving}
      style={{ transitionDuration: `${FADE_DURATION}ms` }}
      className={[
        'fixed inset-0 z-50 flex justify-center bg-gray-100',
        'transition-opacity ease-out motion-reduce:transition-none',
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100',
      ].join(' ')}
    >
      {/* 시안상 워드마크 중심이 화면 중앙보다 12px 위 → pb로 보정 */}
      <div className="flex w-full max-w-[402px] items-center justify-center bg-brand pb-[24px]">
        <Wordmark stacked className="text-center text-[50px] text-white" />
      </div>
    </div>
  )
}
