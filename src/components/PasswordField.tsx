import { useState } from 'react'
import eyeOffIcon from '../assets/icons/eye-off.svg'
import TextField from './TextField'
import type { TextFieldProps } from './TextField'

export type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'trailing'>

/** Figma `비밀번호 입력창` — Eye off 아이콘으로 표시 여부를 토글합니다. */
export default function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <TextField
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-pressed={visible}
          aria-label={visible ? '비밀번호 숨기기' : '비밀번호 표시'}
          className="flex h-[17px] w-[17px] items-center justify-center"
        >
          <img
            src={eyeOffIcon}
            alt=""
            width={17}
            height={17}
            className="block h-[17px] w-[17px]"
          />
        </button>
      }
      {...props}
    />
  )
}
