import { useMemo, useState } from 'react'
import Button from '../components/Button'
import type { ProcedureCondition } from '../lib/procedureStore'

export interface ProcedureDateModalProps {
  open: boolean
  /** 선택된 날짜 */
  value: Date
  onChange: (date: Date) => void
  onClose: () => void
  onConfirm: (condition: ProcedureCondition) => void
}

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/**
 * Figma `시술 날짜 및 상태` (node 857:3629 / 857:3602)
 * 시술 선택 화면 위에 덮이는 달력 모달이다. 날짜와 시술 부위 상태를 모두 골라야 확정할 수 있다.
 */
export default function ProcedureDateModal({
  open,
  value,
  onChange,
  onClose,
  onConfirm,
}: ProcedureDateModalProps) {
  const [viewMonth, setViewMonth] = useState(
    () => new Date(value.getFullYear(), value.getMonth(), 1),
  )
  const [condition, setCondition] = useState<ProcedureCondition | null>(null)

  const cells = useMemo(() => {
    const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1)
    const lastDate = new Date(
      viewMonth.getFullYear(),
      viewMonth.getMonth() + 1,
      0,
    ).getDate()
    const leading = first.getDay()

    return [
      ...Array.from({ length: leading }, () => null),
      ...Array.from({ length: lastDate }, (_, index) => index + 1),
    ]
  }, [viewMonth])

  if (!open) return null

  const today = new Date()

  const moveMonth = (offset: number) => {
    setViewMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1),
    )
  }

  const handlePickDay = (day: number) => {
    const picked = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day)
    onChange(picked)
  }

  const handleConfirm = () => {
    if (!condition) return
    onConfirm(condition)
    setCondition(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      <div className="relative flex w-full max-w-[402px] flex-col bg-gray-950/50 px-[25px]">
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute inset-0 cursor-default"
        />

        <div className="relative mt-auto mb-auto flex w-full flex-col gap-[20px] rounded-[13px] bg-white px-[16px] py-[12px] shadow-lg">
          <p className="text-[18px] font-bold leading-normal text-gray-950">
            시술 날짜를 입력해주세요
          </p>

          <div className="flex flex-col gap-[12px]">
            <div className="flex items-center justify-between">
              <p className="text-[17px] font-semibold leading-none text-black">
                {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
              </p>
              <div className="flex items-center gap-[28px]">
                <button
                  type="button"
                  aria-label="이전 달"
                  onClick={() => moveMonth(-1)}
                  className="text-[20px] leading-none text-brand"
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="다음 달"
                  onClick={() => moveMonth(1)}
                  className="text-[20px] leading-none text-brand"
                >
                  ›
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-y-[6px]">
              {WEEKDAYS.map((weekday) => (
                <span
                  key={weekday}
                  className="text-center text-[11px] font-semibold leading-none text-gray-400"
                >
                  {weekday}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-[4px]">
              {cells.map((day, index) => {
                if (day === null) return <span key={`empty-${index}`} />

                const cellDate = new Date(
                  viewMonth.getFullYear(),
                  viewMonth.getMonth(),
                  day,
                )
                const selected = isSameDay(cellDate, value)
                const isToday = isSameDay(cellDate, today)
                const isFuture = cellDate.getTime() > today.getTime()

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handlePickDay(day)}
                    disabled={isFuture}
                    className="flex h-[38px] items-center justify-center disabled:cursor-not-allowed"
                  >
                    <span
                      className={[
                        'flex h-[34px] w-[34px] items-center justify-center rounded-full text-[19px] leading-none',
                        isFuture
                          ? 'text-gray-300'
                          : selected
                            ? 'bg-black font-semibold text-white'
                            : isToday
                              ? 'bg-brand/15 text-brand'
                              : 'text-black',
                      ].join(' ')}
                    >
                      {day}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="h-px w-full bg-gray-200" />
          </div>

          <div className="flex flex-col gap-[10px]">
            <p className="text-[15px] font-semibold leading-normal text-gray-950">
              <span className="text-brand">Q.</span> 시술한 부위가 어떤가요?
            </p>
            <div className="flex w-full items-center gap-[10px]">
              <button
                type="button"
                onClick={() => setCondition('irritated')}
                aria-pressed={condition === 'irritated'}
                className={[
                  'flex h-[54px] flex-1 items-center justify-center gap-[5px] rounded-[10px] border text-[15px] font-semibold text-gray-950',
                  condition === 'irritated'
                    ? 'border-2 border-brand bg-brand/20'
                    : 'border-gray-200 bg-white',
                ].join(' ')}
              >
                😣 자극이 있어요
              </button>
              <button
                type="button"
                onClick={() => setCondition('comfortable')}
                aria-pressed={condition === 'comfortable'}
                className={[
                  'flex h-[54px] flex-1 items-center justify-center gap-[5px] rounded-[10px] border text-[15px] font-semibold text-gray-950',
                  condition === 'comfortable'
                    ? 'border-2 border-brand bg-brand/20'
                    : 'border-gray-200 bg-white',
                ].join(' ')}
              >
                🙂 편안해요
              </button>
            </div>
          </div>
        </div>

        <div className="relative pb-[50px] pt-[20px]">
          <Button variant="brand" disabled={!condition} onClick={handleConfirm}>
            선택 완료
          </Button>
        </div>
      </div>
    </div>
  )
}
