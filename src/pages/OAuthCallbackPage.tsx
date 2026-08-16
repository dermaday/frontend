import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { exchangeOAuthCode } from '../lib/authApi'
import { consumeOAuthState, type OAuthProvider } from '../lib/oauth'
import { saveAccessToken } from '../lib/session'
import HomeIndicator from '../components/HomeIndicator'
import MobileScreen from '../components/MobileScreen'

function isOAuthProvider(value: string | undefined): value is OAuthProvider {
  return value === 'kakao' || value === 'naver'
}

/**
 * 카카오/네이버 인가 콜백 화면.
 * redirect_uri로 돌아온 code/state를 백엔드(POST /api/auth/:provider)로 전달해
 * 토큰 교환을 위임하고, 발급받은 access token을 저장한다.
 */
export default function OAuthCallbackPage() {
  const { provider } = useParams<{ provider: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 경로가 잘못됐거나 사용자가 인가를 취소한 경우: 조용히 로그인 화면으로 돌려보낸다.
    if (!isOAuthProvider(provider) || searchParams.get('error')) {
      navigate('/login', { replace: true })
      return
    }

    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const savedState = consumeOAuthState(provider)

    if (!code || !state || state !== savedState) {
      navigate('/login', { replace: true })
      return
    }

    exchangeOAuthCode(provider, code, state)
      .then(({ accessToken }) => {
        saveAccessToken(accessToken)
        navigate('/procedurepages/start', { replace: true })
      })
      .catch(() => {
        setError('로그인에 실패했어요. 다시 시도해 주세요.')
      })
  }, [provider, searchParams, navigate])

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
