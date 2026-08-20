import type { TreatmentType } from '../api/treatments'
import type { CosmeticIngredient, ProductType } from '../api/cosmetics'
import cosmeticDefaultEssence from '../assets/icons/cosmetic-default-essence.svg'
import cosmeticDefaultGeneral from '../assets/icons/cosmetic-default-general.svg'
import cosmeticDefaultLotion from '../assets/icons/cosmetic-default-lotion.svg'
import cosmeticDefaultOil from '../assets/icons/cosmetic-default-oil.svg'
import cosmeticDefaultToner from '../assets/icons/cosmetic-default-toner.svg'

export interface Procedure {
  id: string
  name: string
  /** 이름 옆에 옅게 붙는 보조 설명 (예: "볼륨 필러" → "이마 · 앞광대 · 팔자") */
  detail?: string
  beta?: boolean
  /** POST /api/v1/treatments 에 보낼 시술 코드 */
  treatmentType: TreatmentType
}

export interface ProcedureCategory {
  id: string
  title: string
  items: Procedure[]
}

/** Figma `O-01 시술 선택` (node 857:3344) 목록 */
export const PROCEDURE_CATEGORIES: ProcedureCategory[] = [
  {
    id: 'lifting',
    title: '리프팅 · 탄력',
    items: [
      { id: 'ulthera', name: '울쎄라', treatmentType: 'ULTHERA' },
      { id: 'shurink', name: '슈링크', treatmentType: 'SHURINK' },
      { id: 'inmode', name: '인모드', treatmentType: 'INMODE' },
      { id: 'oligio', name: '올리지오', treatmentType: 'OLIGIO' },
      { id: 'thermage', name: '써마지', treatmentType: 'THERMAGE' },
      { id: 'thread-lifting', name: '실리프팅', treatmentType: 'THREAD_LIFT' },
    ],
  },
  {
    id: 'laser',
    title: '색소 · 레이저',
    items: [
      { id: 'pico-toning', name: '피코토닝', treatmentType: 'PICO_TONING' },
      { id: 'laser-toning', name: '레이저 토닝', treatmentType: 'LASER_TONING' },
      { id: 'ipl', name: 'IPL', treatmentType: 'IPL' },
      { id: 'fraxel', name: '프락셀', treatmentType: 'FRAXEL' },
      {
        id: 'spot-removal',
        name: '점 / 잡티 제거',
        treatmentType: 'SPOT_WART_REMOVAL',
      },
    ],
  },
  {
    id: 'peeling',
    title: '필링 · 피부결',
    items: [
      { id: 'aqua-peel', name: '아쿠아필', treatmentType: 'AQUA_PEEL' },
      { id: 'lara-peel', name: '라라필', treatmentType: 'LALA_PEEL' },
      {
        id: 'aladdin-peeling',
        name: '알라딘 필링',
        treatmentType: 'ALADDIN_PEELING',
      },
      {
        id: 'flax-milk-peel',
        name: '플랙필 / 밀크필',
        treatmentType: 'PLAPPEEL_MILKPEEL',
      },
      { id: 'potenza-mts', name: '포텐자 / MTS', treatmentType: 'POTENZA_MTS' },
    ],
  },
  {
    id: 'skin-booster',
    title: '스킨부스터 · 영양',
    items: [
      {
        id: 'rejuran-healer',
        name: '리쥬란 힐러',
        treatmentType: 'REJURAN_HEALER',
      },
      { id: 'juvelook', name: '쥬베룩', treatmentType: 'JUVLOOK' },
      { id: 'exosome', name: '엑소좀', treatmentType: 'EXOSOME' },
      {
        id: 'water-glow-injection',
        name: '물광주사',
        treatmentType: 'HYDRATION_INJECTION',
      },
      {
        id: 'chanel-injection',
        name: '샤넬주사',
        detail: 'NCTF',
        treatmentType: 'CHANEL_INJECTION',
      },
    ],
  },
  {
    id: 'filler',
    title: '보톡스 · 필러',
    items: [
      {
        id: 'jaw-body-botox',
        name: '사각턱 / 바디 보톡스',
        treatmentType: 'SQUARE_JAW_BODY_BOTOX',
      },
      {
        id: 'wrinkle-botox',
        name: '주름 보톡스',
        treatmentType: 'WRINKLE_BOTOX',
      },
      {
        id: 'lip-chin-filler',
        name: '입술 / 턱끝 필러',
        treatmentType: 'LIP_CHIN_FILLER',
      },
      {
        id: 'volume-filler',
        name: '볼륨 필러',
        detail: '이마 · 앞광대 · 팔자',
        treatmentType: 'VOLUME_FILLER',
      },
      {
        id: 'contour-injection',
        name: '윤곽주사',
        treatmentType: 'CONTOUR_INJECTION',
      },
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
    items: ['일반화장품'],
  },
]

/** 성분 버튼 라벨 → POST /api/v1/cosmetics 에 보낼 성분 코드 */
export const INGREDIENT_CODE_MAP: Record<string, CosmeticIngredient> = {
  레티놀: 'RETINOL',
  AHA: 'AHA',
  BHA: 'BHA',
  비타민C: 'VITAMIN_C',
  일반화장품: 'GENERAL_COSMETIC',
}

/** 성분 코드 → 목록 카드에 표시할 라벨 (INGREDIENT_CODE_MAP의 역방향) */
export const INGREDIENT_LABEL_MAP: Record<CosmeticIngredient, string> = {
  RETINOL: '레티놀',
  AHA: 'AHA',
  BHA: 'BHA',
  VITAMIN_C: '비타민C',
  GENERAL_COSMETIC: '일반화장품',
}

/** 등록된 화장품의 대표 성분 라벨. 위험군 성분이 있으면 그걸 우선 보여준다. */
export function getCosmeticCategoryLabel(ingredients: CosmeticIngredient[]): string {
  const risk = ingredients.find((code) => code !== 'GENERAL_COSMETIC')
  return INGREDIENT_LABEL_MAP[risk ?? 'GENERAL_COSMETIC']
}

export interface ProductTypeOption {
  code: ProductType
  name: string
  /** 사진을 등록하지 않았을 때 종류별로 보여주는 대체 이미지 (Figma node 882:9165~9168) */
  defaultImage: string
}

/** Figma `O-02 화장품 성분 선택` 제품 타입 선택지 */
export const PRODUCT_TYPE_OPTIONS: ProductTypeOption[] = [
  { code: 'TONER_SKIN', name: '토너 · 스킨', defaultImage: cosmeticDefaultToner },
  {
    code: 'ESSENCE_AMPOULE_SERUM',
    name: '에센스 · 앰플 · 세럼',
    defaultImage: cosmeticDefaultEssence,
  },
  { code: 'LOTION_CREAM', name: '로션 · 크림', defaultImage: cosmeticDefaultLotion },
  { code: 'OIL', name: '오일', defaultImage: cosmeticDefaultOil },
]

/** 제품 종류를 알 수 없을 때 쓰는 대체 이미지 (Figma node 899:13622) */
export const GENERAL_COSMETIC_IMAGE = cosmeticDefaultGeneral

export function getProductTypeDefaultImage(productType: ProductType): string {
  return (
    PRODUCT_TYPE_OPTIONS.find((option) => option.code === productType)
      ?.defaultImage ?? GENERAL_COSMETIC_IMAGE
  )
}

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

/** "yyyy.MM.dd" 표시용 문자열을 API가 쓰는 "yyyy-MM-dd"로 바꾼다 */
export function toIsoDate(displayDate: string): string {
  return displayDate.replace(/\./g, '-')
}

/** 선택 완료 시 백엔드로 보낼 시술 항목 */
export interface SelectedProcedure {
  id: string
  name: string
  /** yyyy.MM.dd */
  date: string
  condition: import('../lib/procedureStore').ProcedureCondition
  treatmentType: TreatmentType
}

/** 선택 완료 시 백엔드로 보낼 화장품 항목 */
export interface CosmeticProduct {
  id: string
  name: string
  imageUrl?: string
  /** presigned URL 업로드에 쓰이는 원본 파일 */
  imageFile?: File
  ingredients: string[]
  productType: ProductType
  /** 목록 카드에 표시되는 대표 분류 */
  category: string
}
