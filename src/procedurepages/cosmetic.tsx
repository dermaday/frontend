import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCosmetic, type ProductType } from '../api/cosmetics'
import { uploadImage } from '../api/images'
import { createTreatment, listTreatments } from '../api/treatments'
import alertCircleIcon from '../assets/icons/alert-circle.svg'
import cameraIcon from '../assets/icons/camera.svg'
import closeIcon from '../assets/icons/close.svg'
import plusIcon from '../assets/icons/plus.svg'
import { DownUpText, LeftRightText } from '../components/AnimatedText'
import Button from '../components/Button'
import HomeIndicator from '../components/HomeIndicator'
import MobileScreen from '../components/MobileScreen'
import TopAppBar from '../components/TopAppBar'
import { getSelectedProcedures, saveSelectedCosmetics } from '../lib/procedureStore'
import {
  getCosmeticCategoryLabel,
  getProductTypeDefaultImage,
  INGREDIENT_CODE_MAP,
  INGREDIENT_GROUPS,
  INGREDIENT_GUIDE,
  PRODUCT_TYPE_OPTIONS,
  toIsoDate,
  type CosmeticProduct,
} from './procedureData'

const RISK_GROUP = INGREDIENT_GROUPS[0]
const SAFE_GROUP = INGREDIENT_GROUPS[1]

/** 성분 안내 패널이 올라오는 시간 (ms) */
const GUIDE_INTRO_DURATION = 1500

/** Figma `O-02 화장품 성분 선택` (node 399:1890 / 1984 / 2035 / 1939) */
export default function CosmeticPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<CosmeticProduct[]>([])
  const [formOpen, setFormOpen] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSave = (product: CosmeticProduct) => {
    setProducts((prev) =>
      editingId
        ? prev.map((entry) => (entry.id === editingId ? product : entry))
        : [...prev, product],
    )
    setEditingId(null)
    setFormOpen(false)
  }

  const handleCloseForm = () => {
    setEditingId(null)
    setFormOpen(false)
  }

  const handleSubmit = async () => {
    if (submitting) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      const procedures = getSelectedProcedures()

      let treatmentRecordId: number
      if (procedures.length > 0) {
        // 시술 선택 단계에서는 저장만 해두고, 여기서 선택 완료를 눌러야 실제로 서버에 등록한다.
        const treatment = await createTreatment(
          procedures.map((entry) => ({
            treatmentType: entry.treatmentType,
            treatedOn: toIsoDate(entry.date),
            reaction: entry.condition === 'irritated' ? 'IRRITATED' : 'COMFORTABLE',
          })),
        )
        treatmentRecordId = treatment.id
      } else {
        // 화장품 관리 화면에서 바로 들어온 경우 — 새 시술 없이 가장 최근 시술 기록에 화장품만 추가한다.
        const treatments = await listTreatments()
        const latest = treatments.reduce<(typeof treatments)[number] | null>(
          (latest, entry) => (!latest || entry.id > latest.id ? entry : latest),
          null,
        )
        if (!latest) {
          setSubmitError('등록된 시술이 없어요. 시술을 먼저 등록해주세요.')
          return
        }
        treatmentRecordId = latest.id
      }

      for (const product of products) {
        const imageObjectKey = product.imageFile
          ? await uploadImage(product.imageFile)
          : undefined

        const ingredients = [
          ...new Set(
            product.ingredients.map((label) => INGREDIENT_CODE_MAP[label]),
          ),
        ]

        await createCosmetic({
          treatmentRecordId,
          name: product.name,
          productType: product.productType,
          ingredients,
          imageObjectKey,
        })
      }

      saveSelectedCosmetics(products.map((product) => product.name))
      navigate('/procedurepages/loading')
    } catch {
      setSubmitError('등록에 실패했어요. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <MobileScreen>
      <TopAppBar onBack={() => navigate(-1)} />

      <h1 className="w-full text-[24px] font-bold leading-normal text-black">
        <LeftRightText>지금 쓰시는 화장품을 골라주세요</LeftRightText>
      </h1>

      {formOpen ? (
        <CosmeticForm
          initial={editingId ? products.find((entry) => entry.id === editingId) : undefined}
          onClose={handleCloseForm}
          onSave={handleSave}
        />
      ) : (
        <div className="flex w-full flex-1 flex-col">
          <div className="flex w-full flex-col gap-[10px]">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={() => {
                  setEditingId(product.id)
                  setFormOpen(true)
                }}
                onDelete={() =>
                  setProducts((prev) =>
                    prev.filter((entry) => entry.id !== product.id),
                  )
                }
              />
            ))}

            <button
              type="button"
              onClick={() => setFormOpen(true)}
              aria-label="화장품 추가하기"
              className="flex h-[100px] w-full items-center justify-center rounded-[10px] bg-gray-100"
            >
              <img
                src={plusIcon}
                alt=""
                width={15}
                height={15}
                className="block h-[15.4167px] w-[15.4167px]"
              />
            </button>
          </div>

          <div className="mt-auto w-full pt-[40px]">
            {submitError ? (
              <p className="w-full pb-[8px] text-center text-[13px] font-medium text-red-500">
                {submitError}
              </p>
            ) : null}
            <Button
              variant="brand"
              disabled={submitting}
              onClick={handleSubmit}
            >
              {submitting ? '등록 중...' : '선택 완료'}
            </Button>
          </div>
        </div>
      )}

      <HomeIndicator className="h-[25px]" />
    </MobileScreen>
  )
}

interface CosmeticFormProps {
  /** 있으면 수정 모드 — 기존 값으로 채워서 시작하고, 저장 시 같은 id를 유지한다 */
  initial?: CosmeticProduct
  onClose: () => void
  onSave: (product: CosmeticProduct) => void
}

/** 화장품 입력 카드 (node 399:1897) */
function CosmeticForm({ initial, onClose, onSave }: CosmeticFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageUrl, setImageUrl] = useState<string | undefined>(initial?.imageUrl)
  const [imageFile, setImageFile] = useState<File | undefined>(initial?.imageFile)
  const [name, setName] = useState(initial?.name ?? '')
  const [productType, setProductType] = useState<ProductType | undefined>(initial?.productType)
  const [ingredients, setIngredients] = useState<string[]>(initial?.ingredients ?? [])
  const [guideOpen, setGuideOpen] = useState(false)

  // 미리보기용 objectURL은 교체·언마운트 시 해제해야 메모리가 새지 않는다
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl)
    }
  }, [imageUrl])

  const handlePickImage = (file: File | undefined) => {
    if (!file) return
    setImageFile(file)
    setImageUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }

  const toggleIngredient = (value: string) => {
    setIngredients((prev) =>
      prev.includes(value)
        ? prev.filter((entry) => entry !== value)
        : [...prev, value],
    )
  }

  const canAdd =
    name.trim().length > 0 && ingredients.length > 0 && Boolean(productType)

  const handleAdd = () => {
    if (!canAdd || !productType) return

    // 위험 성분(레티놀 등)이 있으면 그걸 우선 보여주고, 없으면 일반화장품으로 표시한다
    const ingredientCodes = ingredients.map((label) => INGREDIENT_CODE_MAP[label])
    const category = getCosmeticCategoryLabel(ingredientCodes)

    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      name: name.trim(),
      imageUrl,
      imageFile,
      ingredients,
      productType,
      category,
    })
  }

  return (
    <div className="flex h-[653px] w-full shrink-0 flex-col gap-[15px] overflow-x-hidden overflow-y-auto rounded-[10px] border border-gray-200 bg-white py-[15px] pl-[23px] pr-[16px]">
      <div className="flex w-full shrink-0 items-center justify-end">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="flex h-[12px] w-[12px] items-center justify-center"
        >
          <img
            src={closeIcon}
            alt=""
            width={12}
            height={12}
            className="block h-[12px] w-[12px]"
          />
        </button>
      </div>

      <section className="flex shrink-0 flex-col gap-[11px]">
        <h2 className="text-[18px] font-semibold leading-normal text-black">
          제품 이미지
        </h2>
        <div className="flex items-start gap-[11px]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="선택한 제품"
              width={80}
              height={80}
              className="block h-[80px] w-[80px] shrink-0 rounded-[10px] object-cover"
            />
          ) : productType ? (
            <img
              src={getProductTypeDefaultImage(productType)}
              alt=""
              width={80}
              height={80}
              className="block h-[80px] w-[80px] shrink-0 rounded-[10px] object-cover"
            />
          ) : null}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="제품 사진 추가"
            className="flex h-[80px] w-[80px] shrink-0 items-center justify-center rounded-[10px] bg-gray-100"
          >
            <img
              src={cameraIcon}
              alt=""
              width={16}
              height={14}
              className="block h-[13.6px] w-[16.2667px]"
            />
          </button>

          {/*
            capture를 붙이면 카메라만 열리므로 일부러 뺐다.
            빼면 모바일에서 "사진 찍기 / 보관함에서 선택" 시트가 뜬다.
          */}
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
        <h2 className="flex items-center gap-[3px] text-[18px] font-semibold leading-normal text-black">
          제품명
          <span className="text-[15px] text-brand">*</span>
        </h2>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="예: 레티놀 세럼"
          aria-label="제품명"
          className="h-[45px] w-full rounded-[10px] bg-gray-100 px-[14px] text-[13px] font-medium leading-none text-gray-950 outline-none placeholder:text-gray-400"
        />
      </section>

      <section className="flex w-full shrink-0 flex-col gap-[11px]">
        <h2 className="flex items-center gap-[3px] text-[18px] font-semibold leading-normal text-black">
          제품 종류
          <span className="text-[15px] text-brand">*</span>
        </h2>
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
                  active
                    ? 'border-brand bg-brand/20'
                    : 'border-gray-200 bg-white',
                ].join(' ')}
              >
                {option.name}
              </button>
            )
          })}
        </div>
      </section>

      <section className="flex w-full shrink-0 flex-col gap-[14px]">
        <div className="flex w-full items-center justify-between">
          <h2 className="flex items-center gap-[3px] text-[18px] font-semibold leading-normal text-black">
            성분
            <span className="text-[15px] text-brand">*</span>
          </h2>
          <button
            type="button"
            onClick={() => setGuideOpen((prev) => !prev)}
            aria-expanded={guideOpen}
            aria-label="성분 안내 보기"
            className="flex h-[18.6667px] w-[18.6667px] items-center justify-center"
          >
            <img
              src={alertCircleIcon}
              alt=""
              width={19}
              height={19}
              className="block h-[18.6667px] w-[18.6667px]"
            />
          </button>
        </div>

        <div className="flex flex-col gap-[10px]">
          {[RISK_GROUP, SAFE_GROUP].map((group) => (
            <div key={group.id} className="flex flex-col gap-[5px]">
              <p className="text-[13px] font-medium leading-none text-black">
                {group.title}
              </p>
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
                        active
                          ? 'border-brand bg-brand/20'
                          : 'border-gray-200 bg-white',
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

      {guideOpen ? (
        <DownUpText
          delay={0}
          duration={GUIDE_INTRO_DURATION}
          className="w-full shrink-0"
        >
          <div className="rounded-b-[10px] rounded-tl-[10px] bg-gray-100 py-[10px] pl-[13px] pr-[10px]">
            <p className="text-[10px] leading-normal text-gray-700">
              라벨에 이런 이름이 있으면 이거예요
            </p>
            <ul className="mt-[6px] flex flex-col gap-[2px]">
              {INGREDIENT_GUIDE.map((entry) => (
                <li
                  key={entry.name}
                  className="text-[10px] leading-normal text-gray-700"
                >
                  · {entry.name}
                  <br />
                  <span className="break-words pl-[8px]">{entry.aliases}</span>
                </li>
              ))}
            </ul>
          </div>
        </DownUpText>
      ) : null}

      <div className="sticky bottom-0 mt-auto w-full shrink-0 bg-gradient-to-b from-transparent via-white to-white pb-[2px] pt-[20px]">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className={[
            'flex h-[45px] w-full items-center justify-center rounded-[10px]',
            'text-[16px] font-semibold leading-none text-white',
            canAdd ? 'bg-brand' : 'cursor-not-allowed bg-gray-400',
          ].join(' ')}
        >
          {initial ? '저장하기' : '추가하기'}
        </button>
      </div>
    </div>
  )
}

interface ProductCardProps {
  product: CosmeticProduct
  onEdit: () => void
  onDelete: () => void
}

/** 등록된 화장품 카드 (node 399:1948) */
function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const tags = product.ingredients.filter((item) =>
    RISK_GROUP.items.includes(item),
  )

  return (
    <div className="flex h-[100px] w-full items-start justify-between rounded-[10px] border border-gray-200 bg-white p-[10px]">
      <div className="flex items-center gap-[10px]">
        <img
          src={product.imageUrl ?? getProductTypeDefaultImage(product.productType)}
          alt=""
          width={80}
          height={80}
          className="block h-[80px] w-[80px] shrink-0 rounded-[10px] object-cover"
        />

        <div className="flex flex-col gap-[13px]">
          <div className="flex flex-col gap-[2px]">
            <p className="text-[10px] leading-none text-gray-600">
              {product.category}
            </p>
            <p className="text-[15px] font-semibold leading-none text-black">
              {product.name}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-[5px]">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex h-[17px] items-center justify-center rounded-[3px] bg-brand/20 px-[8px] text-[10px] leading-none text-brand"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-[8px] text-[13px] font-medium leading-none text-gray-600">
        <button type="button" onClick={onEdit}>
          수정
        </button>
        <button type="button" onClick={onDelete}>
          삭제
        </button>
      </div>
    </div>
  )
}
