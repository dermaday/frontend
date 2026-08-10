import type { ButtonHTMLAttributes } from 'react'
import googleMark from '../assets/icons/google-mark.svg'
import kakaoMark from '../assets/icons/kakao-mark.svg'
import naverMark from '../assets/icons/naver-mark.svg'

export type SocialProvider = 'kakao' | 'naver' | 'google'

export interface SocialButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  provider: SocialProvider
}

const PROVIDER = {
  kakao: {
    label: '카카오로 계속하기',
    icon: kakaoMark,
    iconWidth: 21,
    iconHeight: 20,
    iconClass: 'h-[20px] w-[21px]',
    className: 'bg-kakao text-black',
  },
  naver: {
    label: '네이버로 계속하기',
    icon: naverMark,
    iconWidth: 20,
    iconHeight: 20,
    iconClass: 'h-[20px] w-[20px]',
    className: 'bg-naver text-white',
  },
  google: {
    label: 'Google로 계속하기',
    icon: googleMark,
    iconWidth: 21,
    iconHeight: 22,
    iconClass: 'h-[21.677px] w-[21.313px]',
    className: 'border-2 border-gray-200 bg-white text-gray-950',
  },
} as const

/** Figma `카카오 / 네이버 / Google로 계속하기` (node 273:724, 273:725, 273:730) */
export default function SocialButton({
  provider,
  type = 'button',
  className = '',
  children,
  ...rest
}: SocialButtonProps) {
  const config = PROVIDER[provider]

  return (
    <button
      type={type}
      className={[
        'flex h-[55px] w-full shrink-0 items-center justify-center gap-[15px] rounded-[10px]',
        'text-[16px] font-semibold leading-none',
        'transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40',
        config.className,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      <img
        src={config.icon}
        alt=""
        width={config.iconWidth}
        height={config.iconHeight}
        className={`block ${config.iconClass}`}
      />
      {children ?? config.label}
    </button>
  )
}
