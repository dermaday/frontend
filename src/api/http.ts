import { API_BASE_URL } from './config'

export interface ApiResponse<T> {
  status: number
  success: boolean
  message: string
  data?: T
}

export class ApiError extends Error {
  status: number
  responseBody: unknown

  constructor(status: number, responseBody: unknown) {
    super(`API request failed: ${status}`)
    this.status = status
    this.responseBody = responseBody
  }
}

interface CsrfToken {
  headerName: string
  token: string
}

let cachedCsrfToken: CsrfToken | null = null

async function issueCsrfToken(): Promise<CsrfToken> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/csrf`, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })

  const body = (await response.json()) as ApiResponse<CsrfToken>

  if (!response.ok || !body.data) {
    throw new ApiError(response.status, body)
  }

  cachedCsrfToken = body.data
  return body.data
}

async function getCsrfToken(): Promise<CsrfToken> {
  return cachedCsrfToken ?? issueCsrfToken()
}

export function clearCachedCsrfToken(): void {
  cachedCsrfToken = null
}

/** 회원(GET /api/v1/members/me) 판단 기준: 쿠키를 직접 읽지 않고 이 함수의 성공 여부로만 판단한다. */
export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiResponse<T>> {
  const method = (init.method ?? 'GET').toUpperCase()
  const headers = new Headers(init.headers)

  headers.set('Accept', 'application/json')

  const requiresCsrf = !['GET', 'HEAD', 'OPTIONS'].includes(method)

  if (requiresCsrf) {
    const csrf = await getCsrfToken()
    headers.set(csrf.headerName, csrf.token)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    method,
    headers,
    credentials: 'include',
  })

  const body = (await response.json().catch(() => null)) as ApiResponse<T> | null

  if (!response.ok) {
    throw new ApiError(response.status, body)
  }

  if (!body) {
    throw new Error('API response body is empty')
  }

  return body
}
