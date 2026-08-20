import type { ReactElement } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface NavTab {
  path: string
  label: string
  icon: (active: boolean) => ReactElement
}

function HomeIcon(active: boolean) {
  const color = active ? '#18BFB1' : '#0A0A0A'
  return (
    <svg width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden>
      <path
        d="M2 8.5L9 2L16 8.5V16C16 16.5523 15.5523 17 15 17H3C2.44772 17 2 16.5523 2 16V8.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill={active ? color : 'none'}
      />
    </svg>
  )
}

function CosmeticIcon(active: boolean) {
  const color = active ? '#18BFB1' : '#0A0A0A'
  return (
    <svg width="21" height="19" viewBox="0 0 21 19" fill="none" aria-hidden>
      <rect x="6" y="6" width="9" height="11" rx="1.5" stroke={color} strokeWidth="1.3" />
      <path d="M8 6V3.5C8 2.67157 8.67157 2 9.5 2H11.5C12.3284 2 13 2.67157 13 3.5V6" stroke={color} strokeWidth="1.3" />
      <line x1="6" y1="10" x2="15" y2="10" stroke={color} strokeWidth="1.3" />
    </svg>
  )
}

function ReportIcon(active: boolean) {
  const color = active ? '#18BFB1' : '#0A0A0A'
  return (
    <svg width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden>
      <rect x="1" y="1" width="16" height="17" rx="2.5" stroke={color} strokeWidth="1.3" fill={active ? color : 'none'} />
      <path
        d="M5 9.5L7.5 12L13 6"
        stroke={active ? 'white' : color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function RoutineIcon(active: boolean) {
  const color = active ? '#18BFB1' : '#0A0A0A'
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden>
      <circle cx="9.5" cy="9.5" r="8" stroke={color} strokeWidth="1.3" />
      <path d="M9.5 5V9.5L12.5 11.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const TABS: NavTab[] = [
  { path: '/home', label: '홈', icon: HomeIcon },
  { path: '/cosmetics', label: '화장품', icon: CosmeticIcon },
  { path: '/report', label: '보고서', icon: ReportIcon },
  { path: '/routine', label: '루틴', icon: RoutineIcon },
]

/**
 * Figma `네비게이터 - 홈` (node 882:8988)
 * 화면 길이와 상관없이 항상 뷰포트 하단에 떠 있어야 해서 fixed로 띄운다 —
 * 모바일 프레임(402px)에 맞춰 가운데 정렬한 뒤 그 안에서만 폭을 채운다.
 */
export default function Navigator() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="fixed bottom-0 left-0 z-30 flex w-full justify-center">
      <div className="flex h-[60px] w-full max-w-[402px] shrink-0 items-center justify-center border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)]">
        {TABS.map((tab) => {
          const active = location.pathname === tab.path
          return (
            <button
              key={tab.path}
              type="button"
              onClick={() => navigate(tab.path)}
              className="flex h-[60px] w-[100px] flex-col items-center justify-center gap-[3px]"
            >
              {tab.icon(active)}
              <span
                className={[
                  'text-[10px] leading-normal',
                  active ? 'text-gray-950' : 'text-gray-500',
                ].join(' ')}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
