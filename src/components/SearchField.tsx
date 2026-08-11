import type { InputHTMLAttributes } from 'react'
import searchClearIcon from '../assets/icons/search-clear.svg'
import searchIcon from '../assets/icons/search.svg'

export interface SearchFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string
  onChange: (value: string) => void
}

/** Figma `검색창` (node 399:1258) */
export default function SearchField({
  value,
  onChange,
  placeholder = '시술 검색하기',
  ...rest
}: SearchFieldProps) {
  return (
    <div className="flex h-[50px] w-full shrink-0 items-center gap-[5px] rounded-[10px] bg-gray-100 pl-[13px] pr-[19px]">
      <img
        src={searchIcon}
        alt=""
        width={15}
        height={15}
        className="block h-[15px] w-[15px] shrink-0"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[13px] font-medium leading-none text-gray-950 outline-none placeholder:text-gray-400 [&::-webkit-search-cancel-button]:hidden"
        {...rest}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="검색어 지우기"
          className="flex h-[18px] w-[18px] shrink-0 items-center justify-center"
        >
          <img
            src={searchClearIcon}
            alt=""
            width={18}
            height={18}
            className="block h-[18px] w-[18px]"
          />
        </button>
      ) : null}
    </div>
  )
}
