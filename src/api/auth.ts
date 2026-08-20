import { API_BASE_URL } from './config'
import { apiRequest, clearCachedCsrfToken } from './http'

export type OAuthProvider = 'kakao' | 'naver'

export type MemberRole = 'USER' | 'ADMIN'

export interface Member {
  id: number
  displayName: string
  role: MemberRole
  provider: 'KAKAO' | 'NAVER'
}

/** JWT는 백엔드가 HttpOnly 쿠키로 발급한다 — 프론트는 인가 페이지로 이동만 시킨다. */
export function startOAuthLogin(provider: OAuthProvider): void {
  window.location.assign(`${API_BASE_URL}/oauth2/authorization/${provider}`)
}

export async function getCurrentMember(): Promise<Member> {
  const response = await apiRequest<Member>('/api/v1/members/me')

  if (!response.data) {
    throw new Error('Member response is empty')
  }

  return response.data
}

export async function logout(): Promise<void> {
  try {
    await apiRequest<void>('/api/v1/auth/logout', { method: 'POST' })
  } finally {
    clearCachedCsrfToken()
  }
}

/** 회원 탈퇴. 회원 데이터는 삭제되고, 재가입을 위한 OAuth 식별 정보만 보관된다. */
export async function withdrawMember(): Promise<void> {
  try {
    await apiRequest<void>('/api/v1/members/me', { method: 'DELETE' })
  } finally {
    clearCachedCsrfToken()
  }
}
