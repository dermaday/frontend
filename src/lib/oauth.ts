export type OAuthProvider = 'kakao' | 'naver'

interface OAuthProviderConfig {
  authorizeUrl: string
  clientId: string
  redirectUri: string
}

const STATE_STORAGE_PREFIX = 'dermaday_oauth_state_'

function getProviderConfig(provider: OAuthProvider): OAuthProviderConfig {
  switch (provider) {
    case 'kakao':
      return {
        authorizeUrl: 'https://kauth.kakao.com/oauth/authorize',
        clientId: import.meta.env.VITE_KAKAO_CLIENT_ID,
        redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
      }
    case 'naver':
      return {
        authorizeUrl: 'https://nid.naver.com/oauth2.0/authorize',
        clientId: import.meta.env.VITE_NAVER_CLIENT_ID,
        redirectUri: import.meta.env.VITE_NAVER_REDIRECT_URI,
      }
  }
}

function createState(provider: OAuthProvider): string {
  const state = crypto.randomUUID()
  sessionStorage.setItem(`${STATE_STORAGE_PREFIX}${provider}`, state)
  return state
}

/** 콜백에서 한 번만 읽고 지운다. 네이버는 state 검증이 필수, 카카오도 CSRF 방지를 위해 동일하게 적용한다. */
export function consumeOAuthState(provider: OAuthProvider): string | null {
  const key = `${STATE_STORAGE_PREFIX}${provider}`
  const state = sessionStorage.getItem(key)
  sessionStorage.removeItem(key)
  return state
}

/** 카카오/네이버 인가 화면으로 이동한다. client secret은 프론트에 두지 않고, 토큰 교환은 백엔드가 처리한다. */
export function redirectToOAuthProvider(provider: OAuthProvider): void {
  const { authorizeUrl, clientId, redirectUri } = getProviderConfig(provider)

  if (!clientId || !redirectUri) {
    console.error(`[oauth] ${provider} 설정이 비어 있어요. .env.local의 VITE_${provider.toUpperCase()}_* 값을 채워 주세요.`)
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    state: createState(provider),
  })

  window.location.assign(`${authorizeUrl}?${params.toString()}`)
}
