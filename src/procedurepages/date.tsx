import { useMemo, useState } from 'react'
import Button from '../components/Button'

export interface ProcedureDateModalProps {
  open: boolean
  /** 선택된 날짜 */
  value: Date
  onChange: (date: Date) => void
  onClose: () => void
  onConfirm: () => void
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
 * Figma `O-01 시술 날짜 선택` (node 399:1529)
 * 시술 선택 화면 위에 덮이는 달력 모달이다.
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
    picked.setHours(value.getHours(), value.getMinutes())
    onChange(picked)
  }

  const handleTimeChange = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return
    const next = new Date(value)
    next.setHours(hours, minutes)
    onChange(next)
  }

  const timeValue = `${String(value.getHours()).padStart(2, '0')}:${String(
    value.getMinutes(),
  ).padStart(2, '0')}`

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      <div className="relative flex w-full max-w-[402px] flex-col bg-gray-950/50 px-[25px]">
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute inset-0 cursor-default"
        />

        <div className="relative mt-auto mb-auto w-full rounded-[13px] bg-white px-[16px] py-[12px] shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-[17px] font-semibold leading-none text-black">
              {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </p>
            <div className="flex items-center gap-[28px]">
              <button
                type="button"
                aria-label="이전 달"
                onClick={() => moveMonth(-1)}
                className="text-[20px] leading-none text-[#007AFF]"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="다음 달"
                onClick={() => moveMonth(1)}
                className="text-[20px] leading-none text-[#007AFF]"
              >
                ›
              </button>
            </div>
          </div>

          <div className="mt-[12px] grid grid-cols-7 gap-y-[6px]">
            {WEEKDAYS.map((weekday) => (
              <span
                key={weekday}
                className="text-center text-[11px] font-semibold leading-none text-gray-400"
              >
                {weekday}
              </span>
            ))}
          </div>

          <div className="mt-[8px] grid grid-cols-7 gap-y-[4px]">
            {cells.map((day, index) => {
              if (day === null) return <span key={`empty-${index}`} />

              const cellDate = new Date(
                viewMonth.getFullYear(),
                viewMonth.getMonth(),
                day,
              )
              const selected = isSameDay(cellDate, value)
              const isToday = isSameDay(cellDate, today)

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handlePickDay(day)}
                  className="flex h-[38px] items-center justify-center"
                >
                  <span
                    className={[
                      'flex h-[34px] w-[34px] items-center justify-center rounded-full text-[19px] leading-none',
                      selected
                        ? 'bg-black font-semibold text-white'
                        : isToday
                          ? 'bg-[#007AFF]/15 text-[#007AFF]'
                          : 'text-black',
                    ].join(' ')}
                  >
                    {day}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-[10px] flex items-center justify-between border-t border-gray-200 pt-[12px]">
            <span className="text-[17px] leading-none text-black">Time</span>
            <input
              type="time"
              value={timeValue}
              onChange={(event) => handleTimeChange(event.target.value)}
              aria-label="시술 시각"
              className="rounded-[6px] bg-gray-100 px-[10px] py-[6px] text-[17px] leading-none text-black outline-none"
            />
          </div>
        </div>

        <div className="relative pb-[50px]">
          <Button variant="brand" onClick={onConfirm}>
            선택 완료
          </Button>
        </div>
      </div>
    </div>
  )
}
