import { apiRequest } from './http'

export type ProductType =
  | 'TONER_SKIN'
  | 'ESSENCE_AMPOULE_SERUM'
  | 'LOTION_CREAM'
  | 'OIL'

export type CosmeticIngredient =
  | 'RETINOL'
  | 'AHA'
  | 'BHA'
  | 'VITAMIN_C'
  | 'GENERAL_COSMETIC'

export interface CreateCosmeticRequest {
  treatmentRecordId: number
  name: string
  productType: ProductType
  ingredients: CosmeticIngredient[]
  imageObjectKey?: string
}

export interface CosmeticResponse {
  id: number
  treatmentRecordId: number
  name: string
  productType: ProductType
  productTypeName: string
  ingredients: CosmeticIngredient[]
  imageObjectKey?: string
  createdAt: string
  updatedAt: string
}

export async function createCosmetic(
  request: CreateCosmeticRequest,
): Promise<CosmeticResponse> {
  const response = await apiRequest<CosmeticResponse>('/api/v1/cosmetics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.data) {
    throw new Error('Cosmetic response is empty')
  }

  return response.data
}
