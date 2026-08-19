import skinCombination from '../assets/icons/skin-combination.svg'
import skinDry from '../assets/icons/skin-dry.svg'
import skinNormal from '../assets/icons/skin-normal.svg'
import skinOily from '../assets/icons/skin-oily.svg'

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

export function getSkinTypeMeta(id: SkinType): SkinTypeMeta {
  return SKIN_TYPE_META.find((entry) => entry.id === id) ?? SKIN_TYPE_META[0]
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
