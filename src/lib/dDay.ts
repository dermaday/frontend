import type { ReportProductCard } from '../api/reports'

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** "yyyy-MM-dd"를 로컬 자정 기준 Date로 만든다 (타임존 오차로 하루씩 밀리는 것을 방지) */
function parseIsoDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function startOfToday(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

/** 오늘 - date. 시술을 받은 지 며칠 지났는지 (0 이상, 매일 증가) */
export function daysSince(dateStr: string): number {
  const diff = startOfToday().getTime() - parseIsoDate(dateStr).getTime()
  return Math.max(0, Math.round(diff / MS_PER_DAY))
}

/** date - 오늘. 해금까지 며칠 남았는지 (0 이상, 매일 감소) */
export function daysUntil(dateStr: string): number {
  const diff = parseIsoDate(dateStr).getTime() - startOfToday().getTime()
  return Math.max(0, Math.round(diff / MS_PER_DAY))
}

export interface ReconciledProducts {
  usable: ReportProductCard[]
  restricted: ReportProductCard[]
}

/**
 * 서버가 내려준 usable/restricted 스냅샷을 오늘 날짜 기준으로 다시 계산한다.
 * - restricted 항목의 D-day는 unlockDate로 재계산해서 실제로 매일 줄어들게 만든다.
 * - unlockDate가 지난(daysLeft 0) restricted 항목은 usable로 옮긴다.
 * - 같은 이름이 usable/restricted 양쪽에 동시에 있으면(백엔드 중복 버그) 아직 잠긴 쪽을 우선한다.
 */
export function reconcileProducts(
  usable: ReportProductCard[],
  restricted: ReportProductCard[],
): ReconciledProducts {
  const stillLocked: ReportProductCard[] = []
  const newlyUnlocked: ReportProductCard[] = []
  const seenRestrictedKeys = new Set<string>()

  for (const item of restricted) {
    const key = `${item.name}__${item.unlockDate ?? ''}`
    if (seenRestrictedKeys.has(key)) continue
    seenRestrictedKeys.add(key)

    if (!item.unlockDate) {
      stillLocked.push(item)
      continue
    }

    const daysLeft = daysUntil(item.unlockDate)
    if (daysLeft <= 0) {
      newlyUnlocked.push(item)
    } else {
      stillLocked.push({ ...item, daysLeft, dDayLabel: `D-${daysLeft}` })
    }
  }

  const lockedNames = new Set(stillLocked.map((item) => item.name))
  const seenUsableNames = new Set<string>()
  const resolvedUsable: ReportProductCard[] = []

  for (const item of [...usable, ...newlyUnlocked]) {
    if (lockedNames.has(item.name)) continue
    if (seenUsableNames.has(item.name)) continue
    seenUsableNames.add(item.name)
    resolvedUsable.push(item)
  }

  return { usable: resolvedUsable, restricted: stillLocked }
}
