import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  /** 입력창 오른쪽에 붙는 아이콘 영역 */
  trailing?: ReactNode
}

/** Figma `이메일 / 비밀번호 입력창` (node 5:3079, 5:3080) */
export default function TextField({
  label,
  trailing,
  id,
  className = '',
  ...rest
}: TextFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-[10px]">
      <label
        htmlFor={inputId}
        className="text-[16px] font-semibold leading-none text-black"
      >
        {label}
      </label>
      <div
        className={[
          'flex h-[55px] w-full items-center justify-between',
          'rounded-[10px] border-2 border-gray-300 pl-[11px] pr-[16px]',
          'focus-within:border-gray-800',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <input
          id={inputId}
          className="min-w-0 flex-1 bg-transparent text-[16px] leading-none text-black outline-none placeholder:text-gray-500"
          {...rest}
        />
        {trailing ? (
          <span className="ml-[8px] flex shrink-0 items-center">{trailing}</span>
        ) : null}
      </div>
    </div>
  )
}
