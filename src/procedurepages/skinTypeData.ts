import skinCombination from '../assets/icons/skin-combination.svg'
import skinDry from '../assets/icons/skin-dry.svg'
import skinNormal from '../assets/icons/skin-normal.svg'
import skinOily from '../assets/icons/skin-oily.svg'
import skintypeResultCombination from '../assets/icons/skintype-result-combination.svg'
import skintypeResultDry from '../assets/icons/skintype-result-dry.svg'
import skintypeResultNormal from '../assets/icons/skintype-result-normal.svg'
import skintypeResultOily from '../assets/icons/skintype-result-oily.svg'
import faceCombination from '../assets/images/복합성 피부.png'
import faceDry from '../assets/images/건성 피부.png'
import faceNormal from '../assets/images/중성 피부.png'
import faceOily from '../assets/images/지성 피부.png'

export type SkinType = 'dry' | 'normal' | 'oily' | 'combination'

/** SkinType → POST/PUT /api/v1/skin-profile 에 보낼 코드 */
export const SKIN_TYPE_CODE_MAP: Record<
  SkinType,
  'DRY' | 'NORMAL' | 'OILY' | 'COMBINATION'
> = {
  dry: 'DRY',
  normal: 'NORMAL',
  oily: 'OILY',
  combination: 'COMBINATION',
}

export interface SkinTypeMeta {
  id: SkinType
  label: string
  description: string
  icon: string
  iconWidth: number
  iconHeight: number
}

/** Figma `어떤 피부타입인가요?` 선택지 (node 696:1074 / 700:1456) */
export const SKIN_TYPE_META: SkinTypeMeta[] = [
  {
    id: 'dry',
    label: '건성',
    description: '피부가 당기고\n각질이 자주 생겨요',
    icon: skinDry,
    iconWidth: 50,
    iconHeight: 65,
  },
  {
    id: 'normal',
    label: '중성',
    description: '유수분 밸런스가\n적당해요',
    icon: skinNormal,
    iconWidth: 50,
    iconHeight: 65,
  },
  {
    id: 'oily',
    label: '지성',
    description: '피지와 유분기가 많고\n번들거려요',
    icon: skinOily,
    iconWidth: 51,
    iconHeight: 65,
  },
  {
    id: 'combination',
    label: '복합성',
    description: 'T존은 번들거리고\nU존은 당겨요',
    icon: skinCombination,
    iconWidth: 72,
    iconHeight: 65,
  },
]

export interface SkinTypeResultMeta {
  id: SkinType
  /** 아이콘 위 옅은 회색 소제목 */
  subtitle: string
  label: string
  icon: string
  iconWidth: number
  iconHeight: number
  /** 수분 % */
  moisture: number
  /** 유분 % */
  oil: number
  /** "피부 특징" 박스에 들어가는 두 줄 */
  features: [string, string]
}

/** Figma `결과지 - OO 피부` (node 899:13797 / 13798 / 13800 / 13801) */
export const SKIN_TYPE_RESULT_META: SkinTypeResultMeta[] = [
  {
    id: 'normal',
    subtitle: '유수분 밸런스가 완벽한',
    label: '중성 피부',
    icon: skintypeResultNormal,
    iconWidth: 53,
    iconHeight: 68,
    moisture: 60,
    oil: 50,
    features: [
      '유분과 수분의 균형이 안정적으로 유지되어 세안 후에도 당김이나 번들거림이 거의 없어요',
      '피부결이 매끄럽고 모공이 도드라지지 않으며, 외부 자극이나 계절 변화에도 트러블이 잘 생기지 않아요',
    ],
  },
  {
    id: 'dry',
    subtitle: '수분이 메마른 오아시스형',
    label: '건성 피부',
    icon: skintypeResultDry,
    iconWidth: 53,
    iconHeight: 68,
    moisture: 20,
    oil: 25,
    features: [
      '피부의 천연 보습 인자와 피지 분비가 부족해 세안 직후 극심한 속당김과 뻣뻣함을 느껴요',
      '하얗게 각질이 잘 일어나 화장이 들뜨기 쉽고, 피부 윤기가 부족해 푸석해 보일 수 있어요',
    ],
  },
  {
    id: 'oily',
    subtitle: '유분 폭발 에너지형',
    label: '지성 피부',
    icon: skintypeResultOily,
    iconWidth: 52,
    iconHeight: 67,
    moisture: 35,
    oil: 85,
    features: [
      '피지선 활동이 매우 활발하여 세안 후 얼마 지나지 않아 얼굴 전체에 번들거림과 유분기가 올라와요',
      '과도한 피지 분비로 인해 모공이 넓어지기 쉽고, 피지가 모공을 막아 여드름 및 뾰루지 등의 트러블이 자주 발생해요',
    ],
  },
  {
    id: 'combination',
    subtitle: '낮과 밤 반전형',
    label: '복합성 피부',
    icon: skintypeResultCombination,
    iconWidth: 75,
    iconHeight: 68,
    moisture: 40,
    oil: 70,
    features: [
      '이마와 코 중심의 T존은 피지 분비가 많아 번들거리는 반면, 뺨과 턱 중심의 U존은 건조함을 느끼는 복합적인 상태예요',
      '계절과 일교차, 컨디션에 따라 유수분 편차가 심해 부위별로 트러블과 각질이 동시에 일어날 수 있어요',
    ],
  },
]

export function getSkinTypeResultMeta(id: SkinType): SkinTypeResultMeta {
  return SKIN_TYPE_RESULT_META.find((entry) => entry.id === id) ?? SKIN_TYPE_RESULT_META[0]
}

export function getSkinTypeMeta(id: SkinType): SkinTypeMeta {
  return SKIN_TYPE_META.find((entry) => entry.id === id) ?? SKIN_TYPE_META[0]
}

/** 보고서 `피부타입` 카드에 쓰는 얼굴 일러스트 (마스크 색으로 유·수분 상태를 보여준다) */
export const SKIN_TYPE_FACE_ICON: Record<SkinType, string> = {
  dry: faceDry,
  normal: faceNormal,
  oily: faceOily,
  combination: faceCombination,
}

/**
 * 피부타입 자가 진단 테스트 (node 726:1189 / 726:1392 / 726:1485)
 * 출처: 피부타입테스트. 2022.12.02.; 차민경 외2명(2002)
 *
 * 4열(건성·중성·복합성·지성) × 6행 매트릭스. "맞다"면 오른쪽 칸(같은 행의 다음 열) 질문으로,
 * "아니다"면 아래 칸(같은 열의 다음 행) 질문으로 넘어간다. 마지막 열에서는 답과 무관하게
 * 다음 행으로 내려가고, 마지막 행에서 답하면 그 열의 피부타입이 결과가 된다.
 */
export const SKIN_TYPE_TEST_COLUMNS: SkinType[] = [
  'dry',
  'normal',
  'combination',
  'oily',
]

export const SKIN_TYPE_TEST_GRID: string[][] = [
  [
    '화장을 하면 피부가 좋다는 말을 자주 듣는다',
    'T존 부위가 항상 번들거린다',
    '피부가 얇고 건조한 편이다',
    '얼굴이 자주 붉어진다',
  ],
  [
    '얼굴과 몸에 트러블이 쉽게 생기는 편이다',
    '세안 후 피부가 당기고 각질이 잘 일어난다',
    '화장품 선택 시 민감성 화장품만 골라 쓰는 편이다',
    '얼굴에 잔주름이 많은 편이다',
  ],
  [
    '머리가 가렵고 비듬이 잘 생긴다',
    '화장이 잘 뜨는 편이고 쉽게 지워진다',
    '자외선 노출 시 햇빛 알레르기가 잘 생기는 편이다',
    '화장품 사용 시 트러블이 잘 생기는 편이다',
  ],
  [
    '하루만 샤워를 못해도 머리와 몸이 끈적이고 냄새가 난다',
    '코에 검은 피지가 많은 편이다',
    '각질 때문에 항상 크림이나 보습제를 챙겨 바른다',
    '얼굴과 몸에 털이 많은 편이다',
  ],
  [
    '눈가와 입 주위가 거뭇거뭇하며 닭살 같은 피부결을 지녔다',
    '겨울에 피부가 건조해서 잘 튼다',
    '끈적임이 싫어 가능하면 화장품을 많이 바르지 않는 편이다',
    '아침에는 얼굴이 밝아 보이는데 오후로 갈수록 점점 칙칙해진다',
  ],
  [
    '팔뚝과 허벅지에 닭살 같은 피부결을 지녔다',
    '계절이 바뀔 때 마다 피부 트러블이 잘 생기는 편이다',
    '오랜만에 신경 써서 피부 관리를 하면 트러블이 생긴다',
    '피부 모공이 넓은 편이다',
  ],
]

export interface SkinTypeTestCell {
  row: number
  col: number
}

export const SKIN_TYPE_TEST_START: SkinTypeTestCell = { row: 0, col: 0 }

/** 다음 칸을 계산한다. 마지막 행에서 결정되면 null 대신 결과 타입을 돌려준다. */
export function nextSkinTypeTestCell(
  cell: SkinTypeTestCell,
  isYes: boolean,
): SkinTypeTestCell | { result: SkinType } {
  const lastRow = SKIN_TYPE_TEST_GRID.length - 1
  const lastCol = SKIN_TYPE_TEST_COLUMNS.length - 1

  if (isYes && cell.col < lastCol) {
    return { row: cell.row, col: cell.col + 1 }
  }

  if (cell.row === lastRow) {
    return { result: SKIN_TYPE_TEST_COLUMNS[cell.col] }
  }

  return { row: cell.row + 1, col: cell.col }
}
