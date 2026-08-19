import { apiRequest } from './http'

export type SkinTypeCode = 'DRY' | 'NORMAL' | 'OILY' | 'COMBINATION' | 'UNKNOWN'

export interface SkinProfileResponse {
  skinType: SkinTypeCode
  name: string
  description: string
  updatedAt: string
}

export async function getSkinProfile(): Promise<SkinProfileResponse | null> {
  const response = await apiRequest<SkinProfileResponse>('/api/v1/skin-profile')
  return response.data ?? null
}

export async function upsertSkinProfile(
  skinType: SkinTypeCode,
): Promise<SkinProfileResponse> {
  const response = await apiRequest<SkinProfileResponse>('/api/v1/skin-profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skinType }),
  })

  if (!response.data) {
    throw new Error('Skin profile response is empty')
  }

  return response.data
}
