import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'secondary'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary: 채워진 다크 버튼 / secondary: 라인 버튼 */
  variant?: ButtonVariant
  /** 기본값 true — 부모 너비(352px)를 채웁니다. */
  fullWidth?: boolean
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-gray-800 text-white',
  secondary: 'border-2 border-gray-300 bg-white text-gray-800',
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
