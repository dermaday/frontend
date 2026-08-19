import type { ReportResponse } from '../api/reports'
import type { TreatmentType } from '../api/treatments'
import type { SkinType } from '../procedurepages/skinTypeData'

export type ProcedureCondition = 'irritated' | 'comfortable'

export interface StoredProcedure {
  id: string
  name: string
  /** yyyy.MM.dd */
  date: string
  condition: ProcedureCondition
  treatmentType: TreatmentType
}

const PROCEDURES_KEY = 'dermaday_selected_procedures'
const COSMETICS_KEY = 'dermaday_selected_cosmetics'
const SKIN_TYPE_KEY = 'dermaday_selected_skin_type'

export function saveSelectedProcedures(procedures: StoredProcedure[]): void {
  localStorage.setItem(PROCEDURES_KEY, JSON.stringify(procedures))
}

export function getSelectedProcedures(): StoredProcedure[] {
  const raw = localStorage.getItem(PROCEDURES_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as StoredProcedure[]
  } catch {
    return []
  }
}

export function saveSelectedCosmetics(names: string[]): void {
  localStorage.setItem(COSMETICS_KEY, JSON.stringify(names))
}

export function getSelectedCosmetics(): string[] {
  const raw = localStorage.getItem(COSMETICS_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

export function saveSelectedSkinType(skinType: SkinType): void {
  localStorage.setItem(SKIN_TYPE_KEY, skinType)
}

export function getSelectedSkinType(): SkinType | null {
  return localStorage.getItem(SKIN_TYPE_KEY) as SkinType | null
}

/** 선택된 시술 중 하나라도 자극이 있으면 비정상 보고서로 판정한다. */
export function hasIrritatedProcedure(procedures: StoredProcedure[]): boolean {
  return procedures.some((entry) => entry.condition === 'irritated')
}

const LAST_REPORT_KEY = 'dermaday_last_report'

/** 새로고침·직접 진입 시 라우터 state가 없어도 마지막 생성 결과를 보여주기 위한 캐시 */
export function saveLastReport(report: ReportResponse): void {
  localStorage.setItem(LAST_REPORT_KEY, JSON.stringify(report))
}

export function getLastReport(): ReportResponse | null {
  const raw = localStorage.getItem(LAST_REPORT_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as ReportResponse
  } catch {
    return null
  }
}
