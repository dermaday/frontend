import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ApiError } from './http'
import { getCurrentMember, logout as logoutRequest } from './auth'
import type { Member } from './auth'

interface AuthContextValue {
  /** 로그인 상태 확인 전에는 null, 확인 후 비로그인이면 undefined */
  member: Member | null | undefined
  authLoading: boolean
  /** 로그인 콜백 등에서 쿠키 발급 직후 회원 상태를 다시 읽어올 때 사용 */
  refreshMember: () => Promise<Member | null>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * HttpOnly 쿠키는 React 상태와 별개라, 새로고침마다 `/api/v1/members/me`로 로그인 여부를 복원한다.
 * JWT 자체는 어디에도 저장하지 않는다.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null | undefined>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const refreshMember = useCallback(async () => {
    try {
      const current = await getCurrentMember()
      setMember(current)
      return current
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 401)) {
        console.error('Failed to restore authentication', error)
      }
      setMember(undefined)
      return null
    }
  }, [])

  useEffect(() => {
    refreshMember().finally(() => setAuthLoading(false))
  }, [refreshMember])

  const handleLogout = useCallback(async () => {
    try {
      await logoutRequest()
    } finally {
      setMember(undefined)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ member, authLoading, refreshMember, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
