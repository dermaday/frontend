import { useEffect, useState } from 'react'
import logoDermaday from '../assets/icons/logo-dermaday.svg'

/** 로고가 그대로 노출되는 시간 (ms) */
const VISIBLE_DURATION = 1200
/** 페이드 아웃에 걸리는 시간 (ms) */
const FADE_DURATION = 600

/**
 * Figma `로딩 페이지` (node 5:1195)
 * 앱 위에 덮이는 오버레이라, 사라질 때 아래 화면이 자연스럽게 비쳐 보인다.
 */
export default function SplashOverlay() {
  const [leaving, setLeaving] = useState(false)
  const [removed, setRemoved] = useState(false)

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setLeaving(true), VISIBLE_DURATION)
    const removeTimer = window.setTimeout(
      () => setRemoved(true),
      VISIBLE_DURATION + FADE_DURATION,
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
      {/* 시안상 로고 중심이 화면 중앙보다 14px 위 → pb로 보정 */}
      <div className="flex w-full max-w-[402px] items-center justify-center bg-brand pb-[28px]">
        <img
          src={logoDermaday}
          alt="DermaDay"
          width={137}
          height={87}
          className="block h-[87.5px] w-[136.75px]"
        />
      </div>
    </div>
  )
}
