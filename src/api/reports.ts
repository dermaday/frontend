import { apiRequest } from './http'
import type { SkinTypeCode } from './skinProfile'
import type { TreatmentReaction } from './treatments'

export interface CreateReportRequest {
  /** 생략하면 최신 시술 기록을 쓴다 */
  treatmentRecordId?: number
}

export interface ReportHeader {
  userName: string
  status: 'COUNTDOWN' | 'UNLOCK_DONE' | 'BASIC_CARE'
  dDayLabel?: string
  line: string
}

export interface ReportSkinType {
  code: SkinTypeCode
  name: string
  description: string
}

export interface ReportTreatmentRow {
  name: string
  /** yyyy-MM-dd */
  treatedOn: string
  reaction: TreatmentReaction
  reactionName: string
}

export interface ReportProductCard {
  name: string
  categoryPill: string
  status: 'USABLE' | 'USABLE_NO_LIMIT' | 'USABLE_NOW' | 'LOCKED'
  dDayLabel?: string
  /** yyyy-MM-dd */
  unlockDate?: string
  daysLeft?: number
  line: string
  evidenceTitleEn?: string
  evidenceIds: string[]
}

export interface ReportRoutineStep {
  order: number
  productName: string
  categoryPill: string
  tags: string[]
  tip: string
}

export interface ReportRoutine {
  status: 'LOCKED' | 'PREVIEW' | 'READY' | 'BASIC'
  lockNotice?: string
  cta?: string
  notice?: string
  referenceNote?: string
  evidenceIds: string[]
  steps: ReportRoutineStep[]
}

export interface ReportBasicCareAlert {
  title: string
  body: string
  riskGroups: string[]
  evidenceIds: string[]
}

export interface ReportEvidencePaper {
  id: string
  titleEn: string
  summary: string
  consensusRate?: number
  authors: string
  journal: string
  url: string
}

export interface ReportResponse {
  reportId: string
  /** yyyy-MM-dd */
  asOf: string
  header: ReportHeader
  skinType: ReportSkinType
  treatments: ReportTreatmentRow[]
  products: {
    usable: ReportProductCard[]
    restricted: ReportProductCard[]
    allUnlockedLine: string
  }
  routine: ReportRoutine
  basicCareAlert?: ReportBasicCareAlert
  evidencePapers: ReportEvidencePaper[]
  llm: {
    used: boolean
    model: string
    generated: string[]
    fallback: boolean
  }
  disclaimer: string
}

export async function createReport(
  request: CreateReportRequest = {},
): Promise<ReportResponse> {
  const response = await apiRequest<ReportResponse>('/api/v1/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.data) {
    throw new Error('Report response is empty')
  }

  return response.data
}

export interface RoutinePreviewResponse {
  status: 'LOCKED' | 'PREVIEW' | 'READY' | 'BASIC'
  notice?: string
  steps: ReportRoutineStep[]
}

/** 모든 화장품이 해금됐다고 가정한 추천 루틴 미리보기 ("미리 확인하기") */
export async function previewRoutine(
  reportId: string,
): Promise<RoutinePreviewResponse> {
  const response = await apiRequest<RoutinePreviewResponse>(
    `/api/v1/reports/${encodeURIComponent(reportId)}/routine-preview`,
  )

  if (!response.data) {
    throw new Error('Routine preview response is empty')
  }

  return response.data
}
