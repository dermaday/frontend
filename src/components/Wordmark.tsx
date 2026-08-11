export interface WordmarkProps {
  className?: string
  /** 스플래시처럼 `Derma` / `:Day` 두 줄로 쌓을지 */
  stacked?: boolean
}

/**
 * Figma `Derma :Day` 워드마크 (node 410:2250, 410:2276)
 * 본문은 Pattaya, 콜론만 Pretendard SemiBold다.
 */
export default function Wordmark({
  className = '',
  stacked = false,
}: WordmarkProps) {
  return (
    <p
      className={['font-logo leading-[41px]', className].filter(Boolean).join(' ')}
    >
      Derma
      {stacked ? <br aria-hidden /> : ' '}
      <span className="font-sans font-semibold">:</span>
      Day
    </p>
  )
}
