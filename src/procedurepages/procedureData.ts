export interface Procedure {
  id: string
  name: string
  beta?: boolean
}

export interface ProcedureCategory {
  id: string
  title: string
  items: Procedure[]
}

/** Figma `O-01 시술 선택` (node 399:1251) 목록 */
export const PROCEDURE_CATEGORIES: ProcedureCategory[] = [
  {
    id: 'laser',
    title: '레이저',
    items: [
      { id: 'fractional-co2', name: '프락셔널 CO2 레이저' },
      { id: 'non-ablative', name: '비박피 레이저' },
      { id: 'pico-toning', name: '피코토닝', beta: true },
      { id: 'ipl', name: 'IPL', beta: true },
      { id: 'alex-toning', name: '알렉스토닝', beta: true },
    ],
  },
  {
    id: 'peeling',
    title: '필링 · 니들링',
    items: [
      { id: 'microneedling', name: '일반 마이크로니들링' },
      { id: 'rf-microneedling', name: 'RF 마이크로니들링' },
      { id: 'peeling', name: '필링', beta: true },
    ],
  },
  {
    id: 'filler',
    title: '필러 · 보톡스',
    items: [{ id: 'filler-botox', name: '필러 · 보톡스' }],
  },
  {
    id: 'lifting',
    title: '리프팅',
    items: [
      { id: 'ulthera', name: '울쎄라', beta: true },
      { id: 'shurink', name: '슈링크', beta: true },
      { id: 'inmode', name: '인모드', beta: true },
      { id: 'oligio', name: '올리지오', beta: true },
      { id: 'thermage', name: '써마지', beta: true },
    ],
  },
]

export interface IngredientGroup {
  id: string
  title: string
  items: string[]
}

/** Figma `O-02 화장품 성분 선택` (node 399:1917) */
export const INGREDIENT_GROUPS: IngredientGroup[] = [
  {
    id: 'risk',
    title: '위험군',
    items: ['레티놀', 'AHA', 'BHA', '비타민C'],
  },
  {
    id: 'safe',
    title: '안전군',
    items: ['보습제·안정제', '기타'],
  },
]

/** Figma 성분 안내 툴팁 (node 399:2088) */
export const INGREDIENT_GUIDE: { name: string; aliases: string }[] = [
  {
    name: '레티놀',
    aliases:
      '레티닐팔미테이트 / 레티닐프로피오네이트 / 레티닐아세테이트 / 레티날데하이드 / 하이드록시피나콜론레티노에이트',
  },
  {
    name: 'AHA',
    aliases:
      '글라이콜릭애씨드 / 락틱애씨드 / 만델릭애씨드 / 시트릭애씨드 / 말릭애씨드 / 타타릭애씨드',
  },
  {
    name: 'BHA',
    aliases:
      '살리실릭애씨드 / 베타인살리실레이트 / 카프릴로일살리실릭애씨드 / 흰버드나무껍질추출물',
  },
  {
    name: '비타민C',
    aliases:
      '아스코빅애씨드 / 3-O-에틸아스코빅애씨드 / 아스코빌글루코사이드 / 테트라헥실데실아스코베이트 / 소듐아스코빌포스페이트 / 마그네슘아스코빌포스페이트 / 아스코빌팔미테이트 / 카카두플럼추출물 / 비타민나무열매추출물 / 산사나무추출물',
  },
]

/** yyyy.MM.dd */
export function formatProcedureDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

/** 선택 완료 시 백엔드로 보낼 시술 항목 */
export interface SelectedProcedure {
  id: string
  name: string
  /** yyyy.MM.dd */
  date: string
}

/** 선택 완료 시 백엔드로 보낼 화장품 항목 */
export interface CosmeticProduct {
  id: string
  name: string
  imageUrl?: string
  ingredients: string[]
  /** 목록 카드에 표시되는 대표 분류 */
  category: string
}
