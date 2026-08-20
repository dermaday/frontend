import { useNavigate, useLocation } from 'react-router-dom'
import homeActive from '../assets/icons/홈 활성화 아이콘.png'
import homeInactive from '../assets/icons/홈 비활성화 아이콘.png'
import cosmeticActive from '../assets/icons/화장훔 활성화 아이콘.png'
import cosmeticInactive from '../assets/icons/화장품 비활성화 아이콘.png'
import reportActive from '../assets/icons/보고서 활성화 아이콘.png'
import reportInactive from '../assets/icons/보고서 비활성화 아이콘.png'
import routineActive from '../assets/icons/루틴 활성화 아이콘.png'
import routineInactive from '../assets/icons/루틴 비활성화 아이콘.png'

interface NavTab {
  path: string
  label: string
  activeIcon: string
  inactiveIcon: string
  width: number
  height: number
}

const TABS: NavTab[] = [
  { path: '/home', label: '홈', activeIcon: homeActive, inactiveIcon: homeInactive, width: 18, height: 19 },
  {
    path: '/cosmetics',
    label: '화장품',
    activeIcon: cosmeticActive,
    inactiveIcon: cosmeticInactive,
    width: 21,
    height: 19,
  },
  {
    path: '/report',
    label: '보고서',
    activeIcon: reportActive,
    inactiveIcon: reportInactive,
    width: 18,
    height: 19,
  },
  {
    path: '/routine',
    label: '루틴',
    activeIcon: routineActive,
    inactiveIcon: routineInactive,
    width: 19,
    height: 19,
  },
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
              <img
                src={active ? tab.activeIcon : tab.inactiveIcon}
                alt=""
                width={tab.width}
                height={tab.height}
                className="block"
                style={{ width: tab.width, height: tab.height }}
              />
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
