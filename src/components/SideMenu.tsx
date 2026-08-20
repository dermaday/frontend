import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { withdrawMember } from '../api/auth'
import { useAuth } from '../api/AuthContext'
import { createReport } from '../api/reports'
import type { ReportResponse } from '../api/reports'
import type { TreatmentResponse } from '../api/treatments'
import { saveLastReport } from '../lib/procedureStore'
import closeIcon from '../assets/icons/close.svg'
import Wordmark from './Wordmark'

export interface SideMenuProps {
  open: boolean
  onClose: () => void
  treatments: TreatmentResponse[]
  activeTreatmentId?: number
  onSelectReport: (report: ReportResponse, treatmentId: number) => void
  onDeleteTreatment: (treatmentId: number) => Promise<void>
}

/** Figma `사이드바 - 로그인` (node 982:5240), 햄버거 버튼 클릭 시 왼쪽에서 밀려나오는 메뉴 */
export default function SideMenu({
  open,
  onClose,
  treatments,
  activeTreatmentId,
  onSelectReport,
  onDeleteTreatment,
}: SideMenuProps) {
  const navigate = useNavigate()
  const { member, logout } = useAuth()
  const [switchingId, setSwitchingId] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmWithdraw, setConfirmWithdraw] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)

  const handleSelect = async (treatmentId: number) => {
    if (switchingId !== null) return
    if (treatmentId === activeTreatmentId) {
      onClose()
      return
    }

    setSwitchingId(treatmentId)
    try {
      const report = await createReport({ treatmentRecordId: treatmentId })
      saveLastReport(report)
      onSelectReport(report, treatmentId)
      onClose()
    } catch {
      // 실패하면 메뉴는 열어둔 채로 다시 시도할 수 있게 둔다
    } finally {
      setSwitchingId(null)
    }
  }

  const handleConfirmDelete = async (treatmentId: number) => {
    if (deletingId !== null) return
    setDeletingId(treatmentId)
    try {
      await onDeleteTreatment(treatmentId)
    } finally {
      setDeletingId(null)
      setConfirmDeleteId(null)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleWithdraw = async () => {
    if (withdrawing) return
    setWithdrawing(true)
    try {
      await withdrawMember()
      navigate('/login')
    } catch {
      setWithdrawing(false)
    }
  }

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={[
          'fixed inset-0 z-40 bg-gray-950/40 transition-opacity',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={[
          'fixed left-0 top-0 z-50 flex h-[100dvh] w-[239px] flex-col justify-between overflow-y-auto bg-white px-[13px] pb-[32px] shadow-lg transition-transform duration-300 ease-out',
          'pt-[calc(17px+env(safe-area-inset-top))]',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="flex w-full flex-col gap-[50px]">
          <div className="flex w-full items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              aria-label="메뉴 닫기"
              className="flex h-[20px] w-[20px] items-center justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M1 1L15 15M15 1L1 15"
                  stroke="#0A0A0A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex w-full flex-col gap-[30px]">
            <div className="flex w-[160px] flex-col gap-[15px]">
              <Wordmark className="text-[20px] text-brand" />
              <div className="flex flex-col gap-[3px]">
                <p className="break-keep text-[24px] font-bold leading-normal text-black">
                  {member?.displayName ?? '회원'}님
                </p>
                <p className="text-[13px] font-medium leading-normal text-gray-700">
                  더마데이에 오신것을 환영해요!
                </p>
              </div>
            </div>
            <div className="h-px w-full bg-gray-200" />
          </div>

          <div className="flex flex-col gap-[15px]">
            <p className="text-[18px] font-bold leading-normal text-gray-950">시술 목록</p>
            {treatments.length === 0 ? (
              <p className="text-[13px] font-medium leading-normal text-gray-500">
                등록된 시술이 없어요
              </p>
            ) : (
              <div className="flex gap-[10px]">
                <div className="w-px shrink-0 self-stretch bg-gray-200" aria-hidden />
                <div className="flex w-full flex-col gap-[15px]">
                  {treatments.map((treatment) => {
                    const active = treatment.id === activeTreatmentId
                    const confirming = confirmDeleteId === treatment.id

                    if (confirming) {
                      return (
                        <div
                          key={treatment.id}
                          className="flex h-[40px] w-full items-center justify-between rounded-[10px] bg-gray-100 pl-[14px] pr-[8px]"
                        >
                          <span className="text-[13px] font-medium leading-normal text-gray-700">
                            이 기록을 삭제할까요?
                          </span>
                          <div className="flex items-center gap-[6px]">
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="rounded-[6px] px-[8px] py-[4px] text-[12px] font-semibold text-gray-500"
                            >
                              취소
                            </button>
                            <button
                              type="button"
                              onClick={() => handleConfirmDelete(treatment.id)}
                              disabled={deletingId !== null}
                              className="rounded-[6px] bg-[#e64240] px-[8px] py-[4px] text-[12px] font-semibold text-white disabled:opacity-60"
                            >
                              {deletingId === treatment.id ? '삭제 중...' : '삭제'}
                            </button>
                          </div>
                        </div>
                      )
                    }

                    return (
                      <div key={treatment.id} className="flex w-full items-center gap-[4px]">
                        <button
                          type="button"
                          onClick={() => handleSelect(treatment.id)}
                          disabled={switchingId !== null}
                          className={[
                            'flex h-[40px] w-full items-center rounded-[10px] pl-[14px] text-left text-[15px] font-semibold leading-normal',
                            'disabled:cursor-not-allowed disabled:opacity-60',
                            active ? 'bg-brand/20 text-gray-950' : 'bg-white text-gray-500',
                          ].join(' ')}
                        >
                          {switchingId === treatment.id
                            ? '불러오는 중...'
                            : treatment.latestTreatedOn.replace(/-/g, '.')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(treatment.id)}
                          aria-label="시술 기록 삭제"
                          className="flex h-[24px] w-[24px] shrink-0 items-center justify-center"
                        >
                          <img src={closeIcon} alt="" width={9} height={9} className="block h-[9px] w-[9px]" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-[15px]">
          {confirmWithdraw ? (
            <div className="flex flex-col gap-[8px] rounded-[10px] bg-gray-100 p-[12px]">
              <p className="text-[12px] font-medium leading-normal text-gray-700">
                탈퇴하면 계정 데이터가 모두 삭제돼요. 정말 탈퇴할까요?
              </p>
              <div className="flex gap-[8px]">
                <button
                  type="button"
                  onClick={() => setConfirmWithdraw(false)}
                  className="flex-1 rounded-[6px] bg-white py-[6px] text-[12px] font-semibold text-gray-700"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleWithdraw}
                  disabled={withdrawing}
                  className="flex-1 rounded-[6px] bg-[#e64240] py-[6px] text-[12px] font-semibold text-white disabled:opacity-60"
                >
                  {withdrawing ? '탈퇴 중...' : '탈퇴하기'}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmWithdraw(true)}
              className="text-left text-[12px] font-medium leading-normal text-gray-400"
            >
              회원 탈퇴
            </button>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-[4px] text-[15px] font-semibold leading-normal text-gray-500"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path
                d="M7 3H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M11 12.5 14.5 9 11 5.5M6 9h8.5"
                stroke="#737373"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            로그아웃
          </button>
        </div>
      </div>
    </>
  )
}
