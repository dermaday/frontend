import homeIndicatorIcon from '../assets/icons/home-indicator.svg'

export interface HomeIndicatorProps {
  className?: string
}

/** Figma `하단 탭바` (node 5:3541) */
export default function HomeIndicator({ className = '' }: HomeIndicatorProps) {
  return (
    <div
      className={[
        'flex h-[79px] w-full shrink-0 flex-col items-center justify-end pb-[13px] pt-[7px]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <img
        src={homeIndicatorIcon}
        alt=""
        width={144}
        height={5}
        className="block h-[5px] w-[144px]"
      />
    </div>
  )
}
