/**
 * 사용 예시:
 *
 * import { LeftRightText, DownUpText } from '../components/AnimatedText'
 *
 * // 왼쪽에서 오른쪽으로
 * <LeftRightText delay={0}>시술의 완성</LeftRightText>
 *
 * // 아래에서 위로 (기본 0.5초 뒤 시작)
 * <DownUpText>오늘부터 더마데이가 함께해요!</DownUpText>
 *
 * props:
 *   delay     - 애니메이션 시작 지연 (ms, LeftRightText 기본값 0 / DownUpText 기본값 500)
 *   duration  - 애니메이션 지속 시간 (ms, LeftRightText 기본값 300 / DownUpText 기본값 600)
 *   className - 외부 요소 클래스
 *
 * 텍스트 줄에 씌우는 용도라 <span> 블록으로 렌더링된다. <h1> 안에서도 유효하다.
 */
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export interface AnimatedTextProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
}

interface AnimatedInProps extends AnimatedTextProps {
  /** 시작 지점의 transform 값 */
  from: string
}

function AnimatedIn({
  children,
  className = '',
  delay = 0,
  duration = 300,
  from,
}: AnimatedInProps) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setShown(true), delay)
    return () => window.clearTimeout(timer)
  }, [delay])

  return (
    <span
      className={[
        'block transition-[opacity,transform] ease-out motion-reduce:transition-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        transitionDuration: `${duration}ms`,
        opacity: shown ? 1 : 0,
        transform: shown ? 'translate3d(0, 0, 0)' : from,
      }}
    >
      {children}
    </span>
  )
}

/** 왼쪽에서 오른쪽으로 나타난다. */
export function LeftRightText({
  delay = 0,
  duration = 300,
  ...rest
}: AnimatedTextProps) {
  return (
    <AnimatedIn
      from="translate3d(-18px, 0, 0)"
      delay={delay}
      duration={duration}
      {...rest}
    />
  )
}

/** 아래에서 위로 나타난다. */
export function DownUpText({
  delay = 500,
  duration = 600,
  ...rest
}: AnimatedTextProps) {
  return (
    <AnimatedIn
      from="translate3d(0, 18px, 0)"
      delay={delay}
      duration={duration}
      {...rest}
    />
  )
}
