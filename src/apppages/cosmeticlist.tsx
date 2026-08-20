import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteCosmetic, listCosmeticsByTreatment, updateCosmetic } from '../api/cosmetics'
import type { CosmeticResponse, ProductType } from '../api/cosmetics'
import { getDownloadUrl, uploadImage } from '../api/images'
import { listTreatments } from '../api/treatments'
import cameraIcon from '../assets/icons/camera.svg'
import closeIcon from '../assets/icons/close.svg'
import plusIcon from '../assets/icons/plus.svg'
import Button from '../components/Button'
import Navigator from '../components/Navigator'
import TopAppBar from '../components/TopAppBar'
import {
  getCosmeticCategoryLabel,
  getProductTypeDefaultImage,
  INGREDIENT_CODE_MAP,
  INGREDIENT_GROUPS,
  INGREDIENT_LABEL_MAP,
  PRODUCT_TYPE_OPTIONS,
} from '../procedurepages/procedureData'

const RISK_GROUP = INGREDIENT_GROUPS[0]
const SAFE_GROUP = INGREDIENT_GROUPS[1]

interface CosmeticListEntry extends CosmeticResponse {
  imageUrl?: string
}

/** Figma `화장품` (node 882:9195) */
export default function CosmeticListPage() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState<CosmeticListEntry[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [editingEntry, setEditingEntry] = useState<CosmeticListEntry | null>(null)

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

  const handleSaved = (updated: CosmeticListEntry) => {
    setEntries((prev) =>
      prev?.map((entry) => (entry.id === updated.id ? updated : entry)) ?? prev,
    )
    setEditingEntry(null)
  }

  return (
    <div className="flex min-h-[100dvh] justify-center">
      <div className="flex w-full max-w-[402px] flex-col bg-white">
        <div className="flex flex-1 flex-col gap-[10px] overflow-y-auto px-[25px] pb-[85px] pt-[calc(16px+env(safe-area-inset-top))]">
          <TopAppBar onBack={() => navigate(-1)} />

          <div className="flex w-full items-center justify-between">
            <h1 className="text-[24px] font-bold leading-normal text-black">
              화장품 관리
            </h1>
            <button
              type="button"
              onClick={() => navigate('/procedurepages/cosmetic')}
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
                  onEdit={() => setEditingEntry(entry)}
                />
              ))}
            </div>
          )}
        </div>

        {editingEntry ? (
          <CosmeticEditModal
            entry={editingEntry}
            onClose={() => setEditingEntry(null)}
            onSaved={handleSaved}
          />
        ) : null}

        <Navigator />
      </div>
    </div>
  )
}

interface CosmeticCardProps {
  entry: CosmeticListEntry
  onDelete: () => void
  onEdit: () => void
}

/** Figma node 882:9210 계열 */
function CosmeticCard({ entry, onDelete, onEdit }: CosmeticCardProps) {
  const imageSrc = entry.imageUrl ?? getProductTypeDefaultImage(entry.productType)
  const category = `${getCosmeticCategoryLabel(entry.ingredients)} | ${entry.productTypeName}`

  return (
    <div className="flex w-full flex-col gap-[7px] pb-[10px]">
      <div className="relative size-[168px] shrink-0 overflow-hidden rounded-[10px]">
        <button type="button" onClick={onEdit} aria-label="수정">
          <img
            src={imageSrc}
            alt=""
            width={168}
            height={168}
            className="block size-[168px] object-cover"
          />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="삭제"
          className="absolute right-[7px] top-[7px] flex size-[22px] items-center justify-center rounded-full bg-white/80"
        >
          <img src={closeIcon} alt="" width={10} height={10} className="block h-[10px] w-[10px]" />
        </button>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="flex w-full flex-col items-start gap-[3px] text-left"
      >
        <p className="text-[10px] leading-normal text-gray-600">{category}</p>
        <p className="text-[15px] font-semibold leading-normal text-black">
          {entry.name}
        </p>
      </button>
    </div>
  )
}

interface CosmeticEditModalProps {
  entry: CosmeticListEntry
  onClose: () => void
  onSaved: (updated: CosmeticListEntry) => void
}

/** 등록된 화장품 수정 — PUT /api/v1/cosmetics/{cosmeticId} */
function CosmeticEditModal({ entry, onClose, onSaved }: CosmeticEditModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<File>()
  const [imageUrl, setImageUrl] = useState<string | undefined>(entry.imageUrl)
  const [name, setName] = useState(entry.name)
  const [productType, setProductType] = useState<ProductType>(entry.productType)
  const [ingredients, setIngredients] = useState<string[]>(
    entry.ingredients.map((code) => INGREDIENT_LABEL_MAP[code]),
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (imageFile && imageUrl) URL.revokeObjectURL(imageUrl)
    }
  }, [imageFile, imageUrl])

  const handlePickImage = (file: File | undefined) => {
    if (!file) return
    setImageFile(file)
    setImageUrl((prev) => {
      if (prev && imageFile) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }

  const toggleIngredient = (value: string) => {
    setIngredients((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    )
  }

  const canSave = name.trim().length > 0 && ingredients.length > 0

  const handleSave = async () => {
    if (!canSave || saving) return
    setSaving(true)
    setError(null)

    try {
      const imageObjectKey = imageFile ? await uploadImage(imageFile) : entry.imageObjectKey
      const codes = [...new Set(ingredients.map((label) => INGREDIENT_CODE_MAP[label]))]

      const updated = await updateCosmetic(entry.id, {
        name: name.trim(),
        productType,
        ingredients: codes,
        imageObjectKey,
      })

      onSaved({ ...updated, imageUrl: imageFile ? imageUrl : entry.imageUrl })
    } catch {
      setError('수정에 실패했어요. 다시 시도해주세요.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      <div className="relative flex w-full max-w-[402px] items-center justify-center bg-gray-950/50 px-[25px]">
        <div className="relative flex max-h-[80dvh] w-full flex-col gap-[15px] overflow-y-auto rounded-[10px] border border-gray-200 bg-white py-[15px] pl-[23px] pr-[16px] shadow-lg">
          <div className="flex w-full shrink-0 items-center justify-between">
            <h2 className="text-[18px] font-semibold leading-normal text-black">
              화장품 수정
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="flex h-[24px] w-[24px] items-center justify-center"
            >
              <img src={closeIcon} alt="" width={12} height={12} className="block h-[12px] w-[12px]" />
            </button>
          </div>

          <section className="flex shrink-0 flex-col gap-[11px]">
            <h3 className="text-[15px] font-semibold leading-normal text-black">제품 이미지</h3>
            <div className="flex items-start gap-[11px]">
              <img
                src={imageUrl ?? getProductTypeDefaultImage(productType)}
                alt=""
                width={80}
                height={80}
                className="block h-[80px] w-[80px] shrink-0 rounded-[10px] object-cover"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="제품 사진 변경"
                className="flex h-[80px] w-[80px] shrink-0 items-center justify-center rounded-[10px] bg-gray-100"
              >
                <img src={cameraIcon} alt="" width={16} height={14} className="block h-[13.6px] w-[16.2667px]" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handlePickImage(event.target.files?.[0])}
              />
            </div>
          </section>

          <section className="flex w-full shrink-0 flex-col gap-[11px]">
            <h3 className="text-[15px] font-semibold leading-normal text-black">제품명</h3>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="예: 레티놀 세럼"
              aria-label="제품명"
              className="h-[45px] w-full rounded-[10px] bg-gray-100 px-[14px] text-[13px] font-medium leading-none text-gray-950 outline-none placeholder:text-gray-400"
            />
          </section>

          <section className="flex w-full shrink-0 flex-col gap-[11px]">
            <h3 className="text-[15px] font-semibold leading-normal text-black">제품 종류</h3>
            <div className="flex flex-wrap items-center gap-[5px]">
              {PRODUCT_TYPE_OPTIONS.map((option) => {
                const active = productType === option.code
                return (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => setProductType(option.code)}
                    aria-pressed={active}
                    className={[
                      'flex h-[30px] items-center justify-center rounded-[10px] border px-[15px]',
                      'text-[13px] font-medium leading-none text-black',
                      active ? 'border-brand bg-brand/20' : 'border-gray-200 bg-white',
                    ].join(' ')}
                  >
                    {option.name}
                  </button>
                )
              })}
            </div>
          </section>

          <section className="flex w-full shrink-0 flex-col gap-[14px]">
            <h3 className="text-[15px] font-semibold leading-normal text-black">성분</h3>
            <div className="flex flex-col gap-[10px]">
              {[RISK_GROUP, SAFE_GROUP].map((group) => (
                <div key={group.id} className="flex flex-col gap-[5px]">
                  <p className="text-[13px] font-medium leading-none text-black">{group.title}</p>
                  <div className="flex flex-wrap items-center gap-[5px]">
                    {group.items.map((item) => {
                      const active = ingredients.includes(item)
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleIngredient(item)}
                          aria-pressed={active}
                          className={[
                            'flex h-[30px] items-center justify-center rounded-[10px] border px-[15px]',
                            'text-[13px] font-medium leading-none text-black',
                            active ? 'border-brand bg-brand/20' : 'border-gray-200 bg-white',
                          ].join(' ')}
                        >
                          {item}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {error ? (
            <p className="w-full shrink-0 text-center text-[13px] font-medium text-red-500">
              {error}
            </p>
          ) : null}

          <div className="sticky bottom-0 mt-auto w-full shrink-0 bg-white pt-[4px]">
            <Button variant="brand" disabled={!canSave || saving} onClick={handleSave}>
              {saving ? '저장 중...' : '저장하기'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
