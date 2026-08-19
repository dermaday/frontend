import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteCosmetic, listCosmeticsByTreatment } from '../api/cosmetics'
import type { CosmeticResponse } from '../api/cosmetics'
import { getDownloadUrl } from '../api/images'
import { listTreatments } from '../api/treatments'
import closeIcon from '../assets/icons/close.svg'
import plusIcon from '../assets/icons/plus.svg'
import Navigator from '../components/Navigator'
import TopAppBar from '../components/TopAppBar'
import {
  getCosmeticCategoryLabel,
  getProductTypeDefaultImage,
} from '../procedurepages/procedureData'

interface CosmeticListEntry extends CosmeticResponse {
  imageUrl?: string
}

/** Figma `화장품` (node 882:9195) */
export default function CosmeticListPage() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState<CosmeticListEntry[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const treatments = await listTreatments()
        const lists = await Promise.all(
          treatments.map((treatment) => listCosmeticsByTreatment(treatment.id)),
        )
        const cosmetics = lists.flat()

        const withImages = await Promise.all(
          cosmetics.map(async (cosmetic) => {
            if (!cosmetic.imageObjectKey) return cosmetic
            try {
              const imageUrl = await getDownloadUrl(cosmetic.imageObjectKey)
              return { ...cosmetic, imageUrl }
            } catch {
              return cosmetic
            }
          }),
        )

        if (!ignore) setEntries(withImages)
      } catch {
        if (!ignore) setLoadError('화장품 목록을 불러오지 못했어요.')
      }
    }

    void load()
    return () => {
      ignore = true
    }
  }, [])

  const handleDelete = async (cosmeticId: number) => {
    setEntries((prev) => prev?.filter((entry) => entry.id !== cosmeticId) ?? prev)
    try {
      await deleteCosmetic(cosmeticId)
    } catch {
      setLoadError('삭제에 실패했어요. 새로고침 후 다시 시도해주세요.')
    }
  }

  return (
    <div className="flex min-h-[100dvh] justify-center">
      <div className="flex w-full max-w-[402px] flex-col bg-white">
        <div className="flex flex-1 flex-col gap-[10px] overflow-y-auto px-[25px] pb-[25px] pt-[calc(16px+env(safe-area-inset-top))]">
          <TopAppBar onBack={() => navigate(-1)} />

          <div className="flex w-full items-center justify-between">
            <h1 className="text-[24px] font-bold leading-normal text-black">
              화장품 관리
            </h1>
            <button
              type="button"
              onClick={() => navigate('/procedurepages/start')}
              aria-label="화장품 추가하기"
              className="flex h-[33px] w-[33px] items-center justify-center"
            >
              <img
                src={plusIcon}
                alt=""
                width={18}
                height={18}
                className="block h-[18px] w-[18px]"
              />
            </button>
          </div>

          {loadError ? (
            <p className="w-full py-[10px] text-center text-[13px] font-medium text-red-500">
              {loadError}
            </p>
          ) : null}

          {entries === null ? null : entries.length === 0 ? (
            <div className="flex h-[220px] w-full items-center justify-center rounded-[10px] bg-gray-100">
              <p className="text-[13px] font-medium leading-normal text-gray-500">
                등록된 화장품이 없어요
              </p>
            </div>
          ) : (
            <div className="grid w-full grid-cols-2 gap-x-[16px] gap-y-[25px]">
              {entries.map((entry) => (
                <CosmeticCard
                  key={entry.id}
                  entry={entry}
                  onDelete={() => handleDelete(entry.id)}
                />
              ))}
            </div>
          )}
        </div>

        <Navigator />
      </div>
    </div>
  )
}

interface CosmeticCardProps {
  entry: CosmeticListEntry
  onDelete: () => void
}

/** Figma node 882:9210 계열 */
function CosmeticCard({ entry, onDelete }: CosmeticCardProps) {
  const imageSrc = entry.imageUrl ?? getProductTypeDefaultImage(entry.productType)
  const category = `${getCosmeticCategoryLabel(entry.ingredients)} | ${entry.productTypeName}`

  return (
    <div className="flex w-full flex-col gap-[7px] pb-[10px]">
      <div className="relative size-[168px] shrink-0 overflow-hidden rounded-[10px]">
        <img
          src={imageSrc}
          alt=""
          width={168}
          height={168}
          className="block size-[168px] object-cover"
        />
        <button
          type="button"
          onClick={onDelete}
          aria-label="삭제"
          className="absolute right-[7px] top-[7px] flex size-[22px] items-center justify-center rounded-full bg-white/80"
        >
          <img src={closeIcon} alt="" width={10} height={10} className="block h-[10px] w-[10px]" />
        </button>
      </div>
      <div className="flex w-full flex-col gap-[3px]">
        <p className="text-[10px] leading-normal text-gray-600">{category}</p>
        <p className="text-[15px] font-semibold leading-normal text-black">
          {entry.name}
        </p>
      </div>
    </div>
  )
}
