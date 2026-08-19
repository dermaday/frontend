/** Figma `정상/비정상 피부 보고서` (node 882:7212 / 7457 / 7797 / 8030 / 8234) 대표 데이터 */

export interface EvidencePaper {
  title: string
  summary: string
}

export const EVIDENCE_PAPERS: EvidencePaper[] = [
  {
    title: 'International Expert Consensus on Integrated Skin...',
    summary:
      '21명의 피부과 전문가 합의로, 레티노이드는 시술 당일과 단기 회복기(0~7일) 사용을 피하도록 평가됐어요.',
  },
  {
    title: 'International Expert Consensus on Integrated Skin...',
    summary:
      '21명의 피부과 전문가 합의로, 레티노이드는 시술 당일과 단기 회복기(0~7일) 사용을 피하도록 평가됐어요.',
  },
  {
    title: 'International Expert Consensus on Integrated Skin...',
    summary:
      '21명의 피부과 전문가 합의로, 레티노이드는 시술 당일과 단기 회복기(0~7일) 사용을 피하도록 평가됐어요.',
  },
]

export interface UsableCosmetic {
  name: string
  category: string
  note: string
}

export const USABLE_COSMETICS: UsableCosmetic[] = [
  { name: '센텔라 스킨', category: '일반화장품 | 토너 · 스킨', note: '회피기간 없이 바로 사용 가능해요' },
  { name: '레티놀 크림', category: '레티놀 | 크림 · 로션', note: '회피기간 없이 바로 사용 가능해요' },
]

export interface RestrictedCosmetic {
  name: string
  category: string
  note: string
  /** 사용 가능해지기까지 남은 일수 */
  daysLeft: number
}

export const RESTRICTED_COSMETICS: RestrictedCosmetic[] = [
  {
    name: '센텔라 스킨',
    category: '일반화장품 | 토너 · 스킨',
    note: '시술 후 피부 장벽이 약해진 상태에서 피부에 자극을 줄 수 있어요',
    daysLeft: 1,
  },
  {
    name: '센텔라 스킨',
    category: '일반화장품 | 토너 · 스킨',
    note: '시술 후 피부 장벽이 약해진 상태에서 피부에 자극을 줄 수 있어요',
    daysLeft: 7,
  },
]

export interface RoutineStep {
  order: number
  name: string
  category: string
}

export const ROUTINE_STEPS: RoutineStep[] = [
  { order: 1, name: '화장품명', category: 'BHA | 토너 · 스킨' },
  { order: 2, name: '화장품명', category: '레티놀 | 에센스 · 앰플 · 세럼' },
  { order: 3, name: '화장품명', category: 'AHA | 크림 · 로션' },
  { order: 4, name: '화장품명', category: '비타민C | 오일' },
]

/** 모든 화장품 해금까지 남은 일수 (목업) */
export const UNLOCK_DAYS_LEFT = 7

export const HIGH_RISK_INGREDIENTS = ['레티놀', 'AHA', 'BHA', '비타민C']

/** 피부타입 카드 설명 (node 882:7228 계열) */
export const SKIN_TYPE_REPORT_COPY: Record<
  import('../procedurepages/skinTypeData').SkinType,
  string[]
> = {
  combination: [
    'T존 부위는 지성상태에 가깝고 다른 부위는 중성 / 건성 피부 상태를 가지고 있어요',
    '눈가의 잔주름, 볼에 기미가 잘생기며 계절에 따라 피부 트러블이 자주 발생해요',
  ],
  dry: [
    '피부 전반적으로 유·수분이 부족해 당김과 각질이 잘 생겨요',
    '자극에 예민해 시술 후 트러블이 오래 지속될 수 있어요',
  ],
  normal: [
    '유·수분 밸런스가 안정적으로 유지되는 편이에요',
    '큰 트러블 없이 대부분의 화장품을 무난하게 사용할 수 있어요',
  ],
  oily: [
    '피지 분비가 많아 모공이 넓고 번들거림이 잦아요',
    '시술 후에도 비교적 회복이 빠르지만 트러블성 성분엔 주의가 필요해요',
  ],
}
