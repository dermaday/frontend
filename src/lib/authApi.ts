import type { OAuthProvider } from './oauth'

export interface AuthResult {
  accessToken: string
  refreshToken?: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

/** 인가 코드를 백엔드로 전달해 토큰 교환을 위임받고, 세션(access token)을 발급받는다. */
export async function exchangeOAuthCode(
  provider: OAuthProvider,
  code: string,
  state: string,
): Promise<AuthResult> {
  const res = await fetch(`${API_BASE_URL}/api/auth/${provider}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, state }),
  })

  if (!res.ok) {
    throw new Error(`${provider} 로그인에 실패했어요. (${res.status})`)
  }

  return res.json() as Promise<AuthResult>
}
