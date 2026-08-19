import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DownUpText, LeftRightText } from '../components/AnimatedText'
import BottomActionBar from '../components/BottomActionBar'
import Button from '../components/Button'
import HomeIndicator from '../components/HomeIndicator'
import MobileScreen from '../components/MobileScreen'
import ProcedureItem from '../components/ProcedureItem'
import SearchField from '../components/SearchField'
import TopAppBar from '../components/TopAppBar'
import { saveSelectedProcedures, type ProcedureCondition } from '../lib/procedureStore'
import ProcedureDateModal from './date'
import { formatProcedureDate, PROCEDURE_CATEGORIES } from './procedureData'
import type { Procedure, SelectedProcedure } from './procedureData'

/** 목록 항목 등장 애니메이션 (ms) */
const ITEM_INTRO_DELAY = 300
const ITEM_INTRO_STAGGER = 120
const ITEM_INTRO_DURATION = 600

/** Figma `O-01 시술 선택` (node 399:1251) */
export default function ProcedureChoicePage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [selected, setSelected] = useState<SelectedProcedure[]>([])
  const [pending, setPending] = useState<Procedure | null>(null)
  const [pendingDate, setPendingDate] = useState(() => new Date())

  const categories = useMemo(() => {
    const query = keyword.trim()
    if (!query) return PROCEDURE_CATEGORIES

    return PROCEDURE_CATEGORIES.map((category) => ({
      ...category,
      items: category.items.filter((item) => item.name.includes(query)),
    })).filter((category) => category.items.length > 0)
  }, [keyword])

  // 목록 전체를 관통하는 순번 — 카테고리를 넘어가도 순서대로 올라온다
  const orderIndex = useMemo(() => {
    const map = new Map<string, number>()
    let index = 0
    categories.forEach((category) => {
      category.items.forEach((item) => map.set(item.id, index))
      index += category.items.length
    })
    return map
  }, [categories])

  const handleToggle = (item: Procedure) => {
    const already = selected.find((entry) => entry.id === item.id)
    if (already) {
      setSelected((prev) => prev.filter((entry) => entry.id !== item.id))
      return
    }

    setPendingDate(new Date())
    setPending(item)
  }

  const handleSubmit = () => {
    saveSelectedProcedures(selected)
    navigate('/procedurepages/cosmetic')
  }

  const handleConfirmDate = (condition: ProcedureCondition) => {
    if (!pending) return

    setSelected((prev) => [
      ...prev,
      {
        id: pending.id,
        name: pending.name,
        date: formatProcedureDate(pendingDate),
        condition,
        treatmentType: pending.treatmentType,
      },
    ])
    setPending(null)
  }

  return (
    <>
      <MobileScreen>
        <TopAppBar onBack={() => navigate(-1)} />

        <h1 className="w-full text-[24px] font-bold leading-normal text-black">
          <LeftRightText>어떤 시술을 받으셨나요?</LeftRightText>
        </h1>

        <SearchField value={keyword} onChange={setKeyword} />

        <div className="flex w-full flex-col gap-[20px]">
          {categories.map((category) => (
            <section
              key={category.id}
              className="flex w-full flex-col gap-[13px]"
            >
              <h2 className="w-full text-[18px] font-semibold leading-normal text-black">
                {category.title}
              </h2>
              {category.items.map((item) => {
                const picked = selected.find((entry) => entry.id === item.id)
                return (
                  <DownUpText
                    key={item.id}
                    className="w-full"
                    delay={
                      ITEM_INTRO_DELAY +
                      (orderIndex.get(item.id) ?? 0) * ITEM_INTRO_STAGGER
                    }
                    duration={ITEM_INTRO_DURATION}
                  >
                    <ProcedureItem
                      name={item.name}
                      detail={item.detail}
                      beta={item.beta}
                      selected={Boolean(picked)}
                      date={picked?.date}
                      condition={picked?.condition}
                      onToggle={() => handleToggle(item)}
                    />
                  </DownUpText>
                )
              })}
            </section>
          ))}
        </div>

        <BottomActionBar>
          <Button
            variant="brand"
            disabled={selected.length === 0}
            onClick={handleSubmit}
          >
            선택 완료
          </Button>
        </BottomActionBar>

        <HomeIndicator className="h-[25px]" />
      </MobileScreen>

      <ProcedureDateModal
        open={pending !== null}
        value={pendingDate}
        onChange={setPendingDate}
        onClose={() => setPending(null)}
        onConfirm={handleConfirmDate}
      />
    </>
  )
}
  