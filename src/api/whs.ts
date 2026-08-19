import type { CosmeticIngredient, CosmeticResponse, ProductType } from './cosmetics'
import { apiRequest } from './http'
import type { SkinProfileResponse } from './skinProfile'
import type { TreatmentReaction, TreatmentResponse, TreatmentType } from './treatments'

export type WhsSkinTypeCode = 'DRY' | 'NORMAL' | 'OILY' | 'COMBINATION' | 'UNKNOWN'

export interface WhsSkin {
  skinType: WhsSkinTypeCode
  name: string
  description: string
}

export interface WhsTreatment {
  treatmentType: TreatmentType
  treatmentName: string
  /** yyyy-MM-dd */
  treatedOn: string
  reaction: TreatmentReaction
  reactionName: string
}

export interface WhsCosmetic {
  name: string
  productType: ProductType
  productTypeName: string
  ingredients: CosmeticIngredient[]
  imageObjectKey?: string
}

export interface WhsResponse {
  memberName: string
  skin: WhsSkin
  treatments: WhsTreatment[]
  cosmetics: WhsCosmetic[]
}

export interface WhsImportResponse {
  alreadyImported: boolean
  skinProfile: SkinProfileResponse
  treatmentRecord: TreatmentResponse
  cosmetics: CosmeticResponse[]
}

/** WHS(병원 시스템) 미리보기 — 실제 등록 전 조회만 한다 */
export async function previewWhs(): Promise<WhsResponse> {
  const response = await apiRequest<WhsResponse>('/api/v1/whs')

  if (!response.data) {
    throw new Error('WHS response is empty')
  }

  return response.data
}

/** WHS 정보를 실제로 내 계정에 등록한다. 이미 등록했다면 기존 결과를 그대로 돌려받는다. */
export async function importWhs(): Promise<WhsImportResponse> {
  const response = await apiRequest<WhsImportResponse>('/api/v1/whs/import', {
    method: 'POST',
  })

  if (!response.data) {
    throw new Error('WHS import response is empty')
  }

  return response.data
}
