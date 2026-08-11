import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'brand' | 'outline'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary: 다크 / secondary: 굵은 라인 / brand: 민트 / outline: 얇은 라인 */
  variant?: ButtonVariant
  /** 기본값 true — 부모 너비(352px)를 채웁니다. */
  fullWidth?: boolean
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-gray-800 text-white',
  secondary: 'border-2 border-gray-300 bg-white text-gray-800',
  // 시안상 비활성은 투명도가 아니라 회색 채움이다
  brand:
    'bg-brand text-white disabled:bg-gray-400 disabled:text-white disabled:opacity-100',
  outline: 'border border-gray-200 bg-white text-gray-950',
}

/** Figma `로그인 버튼` 컴포넌트 (node 5:3562) */
export default function Button({
  variant = 'primary',
  fullWidth = true,
  type = 'button',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        'flex h-[55px] shrink-0 items-center justify-center rounded-[10px] px-[24px] py-[18px]',
        'text-[16px] font-semibold leading-none',
        'transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40',
        VARIANT_CLASS[variant],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </button>
  )
}
