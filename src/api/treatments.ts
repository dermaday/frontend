import { apiRequest } from './http'

export type TreatmentType =
  | 'ULTHERA'
  | 'SHURINK'
  | 'INMODE'
  | 'OLIGIO'
  | 'THERMAGE'
  | 'THREAD_LIFT'
  | 'PICO_TONING'
  | 'LASER_TONING'
  | 'IPL'
  | 'FRAXEL'
  | 'SPOT_WART_REMOVAL'
  | 'AQUA_PEEL'
  | 'LALA_PEEL'
  | 'ALADDIN_PEELING'
  | 'PLAPPEEL_MILKPEEL'
  | 'POTENZA_MTS'
  | 'REJURAN_HEALER'
  | 'JUVLOOK'
  | 'EXOSOME'
  | 'HYDRATION_INJECTION'
  | 'CHANEL_INJECTION'
  | 'SQUARE_JAW_BODY_BOTOX'
  | 'WRINKLE_BOTOX'
  | 'LIP_CHIN_FILLER'
  | 'VOLUME_FILLER'
  | 'CONTOUR_INJECTION'

export type TreatmentReaction = 'COMFORTABLE' | 'IRRITATED'

export interface TreatmentItemRequest {
  treatmentType: TreatmentType
  /** yyyy-MM-dd */
  treatedOn: string
  reaction: TreatmentReaction
}

export interface TreatmentItemResponse extends TreatmentItemRequest {
  id: number
  treatmentName: string
  reactionName: string
}

export interface TreatmentResponse {
  id: number
  source: 'MANUAL' | 'WHS_MOCK'
  /** yyyy-MM-dd */
  latestTreatedOn: string
  items: TreatmentItemResponse[]
  createdAt: string
  updatedAt: string
}

export async function createTreatment(
  items: TreatmentItemRequest[],
): Promise<TreatmentResponse> {
  const response = await apiRequest<TreatmentResponse>('/api/v1/treatments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })

  if (!response.data) {
    throw new Error('Treatment response is empty')
  }

  return response.data
}
