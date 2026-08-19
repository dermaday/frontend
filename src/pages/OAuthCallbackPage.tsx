import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../api/AuthContext'
import HomeIndicator from '../components/HomeIndicator'
import MobileScreen from '../components/MobileScreen'

const ERROR_MESSAGES: Record<string, string> = {
  access_denied: '소셜 로그인 동의가 취소됐어요.',
  missing_required_profile: '필수 회원 정보 제공에 동의해야 해요.',
  oauth2_login_failed: '소셜 로그인에 실패했어요. 다시 시도해 주세요.',
}

/**
 * 카카오/네이버 로그인 콜백 화면.
 * JWT는 백엔드가 HttpOnly 쿠키로 이미 발급한 뒤 이 경로로 이동시킨 것이므로,
 * 여기서는 code를 교환하지 않고 `/api/v1/members/me`로 로그인 성공 여부만 확인한다.
 */
export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { refreshMember } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    const errorCode = searchParams.get('error')
    if (errorCode) {
      setError(ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.oauth2_login_failed)
      return
    }

    refreshMember().then((member) => {
      if (ignore) return
      if (member) {
        navigate('/procedurepages/start', { replace: true })
      } else {
        setError('로그인 쿠키를 확인할 수 없어요. 다시 로그인해 주세요.')
      }
    })

    return () => {
      ignore = true
    }
  }, [searchParams, refreshMember, navigate])

  return (
    <MobileScreen>
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-[16px]">
        {error ? (
          <>
            <p className="text-center text-[16px] font-semibold text-gray-700">
              {error}
            </p>
            <button
              type="button"
              className="text-[14px] font-semibold text-brand underline"
              onClick={() => navigate('/login', { replace: true })}
            >
              로그인으로 돌아가기
            </button>
          </>
        ) : (
          <p className="text-center text-[16px] font-semibold text-gray-700">
            로그인 처리 중이에요...
          </p>
        )}
      </div>

      <HomeIndicator />
    </MobileScreen>
  )
}
