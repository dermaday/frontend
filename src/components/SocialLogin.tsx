import googleIcon from '../assets/icons/google.svg'
import kakaoIcon from '../assets/icons/kakao.svg'
import naverIcon from '../assets/icons/naver.svg'

const PROVIDERS = [
  { key: 'kakao', label: '카카오로 로그인', icon: kakaoIcon },
  { key: 'naver', label: '네이버로 로그인', icon: naverIcon },
  { key: 'google', label: '구글로 로그인', icon: googleIcon },
] as const

export interface SocialLoginProps {
  onSelect?: (provider: (typeof PROVIDERS)[number]['key']) => void
}

/** Figma `sns 계정 로그인 라인` + `sns 로그인` (node 53:1527, 53:1519) */
export default function SocialLogin({ onSelect }: SocialLoginProps) {
  return (
    <>
      <div className="flex h-[27px] w-full shrink-0 items-center px-[20px]">
        <span className="h-px w-[85px] bg-gray-300" />
        <span className="flex-1 shrink-0 whitespace-nowrap text-center text-[14px] leading-none text-gray-400">
          SNS 계정으로 로그인
        </span>
        <span className="h-px w-[85px] bg-gray-300" />
      </div>

      <div className="flex h-[50px] w-full shrink-0 items-center justify-center gap-[18px]">
        {PROVIDERS.map((provider) => (
          <button
            key={provider.key}
            type="button"
            aria-label={provider.label}
            onClick={() => onSelect?.(provider.key)}
            className="flex h-[50px] w-[50px] items-center justify-center rounded-full"
          >
            <img
              src={provider.icon}
              alt=""
              width={50}
              height={50}
              className="block h-[50px] w-[50px]"
            />
          </button>
        ))}
      </div>
    </>
  )
}
