import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getDownloadUrl } from '../api/images'
import { importWhs } from '../api/whs'
import type { WhsCosmetic, WhsResponse, WhsSkinTypeCode, WhsTreatment } from '../api/whs'
import chevronUpIcon from '../assets/icons/chevron-left.svg'
import whsReactionComfortable from '../assets/icons/whs-reaction-comfortable.svg'
import Button from '../components/Button'
import HomeIndicator from '../components/HomeIndicator'
import MobileScreen from '../components/MobileScreen'
import TopAppBar from '../components/TopAppBar'
import {
  getCosmeticCategoryLabel,
  getProductTypeDefaultImage,
} from './procedureData'
import { getSkinTypeResultMeta, type SkinType } from './skinTypeData'

const WHS_SKIN_TYPE_MAP: Record<WhsSkinTypeCode, SkinType> = {
  DRY: 'dry',
  NORMAL: 'normal',
  OILY: 'oily',
  COMBINATION: 'combination',
  UNKNOWN: 'normal',
}

interface WhsResultLocationState {
  data?: WhsResponse
}

/** Figma `WHS 정보 불러오기` (node 899:10423) */
export default function WhsResultPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const data = (location.state as WhsResultLocationState | null)?.data

  const [treatmentsOpen, setTreatmentsOpen] = useState(true)
  const [cosmeticsOpen, setCosmeticsOpen] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!data) {
    navigate('/procedurepages/start', { replace: true })
    return null
  }

  const meta = getSkinTypeResultMeta(WHS_SKIN_TYPE_MAP[data.skin.skinType])

  const handleImport = async () => {
    if (submitting) return
    setSubmitting(true)
    setSubmitError(null)

    try {
      const result = await importWhs()
      // 이미 등록했던 WHS라면 기존 시술 기록을 그대로 돌려주는데, 그 사이 다른 시술을 추가로
      // 등록했을 수 있어서 "가장 최근 기록"을 자동으로 고르면 WHS가 아닌 다른 기록이 뽑힐 수 있다.
      // 그래서 어떤 기록의 리포트를 만들지 여기서 명시적으로 지정한다.
      navigate('/procedurepages/loading', {
        state: { treatmentRecordId: result.treatmentRecord.id },
      })
    } catch {
      setSubmitError('등록에 실패했어요. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <MobileScreen>
      <TopAppBar onBack={() => navigate(-1)} />

      <div className="flex w-full flex-1 flex-col gap-[25px] pb-[80px]">
        <h1 className="text-[24px] font-bold leading-normal text-black">
          {data.memberName}님의 WHS 정보
        </h1>

        <div className="flex h-[80px] w-full items-center rounded-[10px] border border-gray-200 bg-white pl-[22px]">
          <div className="flex items-center gap-[30px]">
            <div className="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-brand/20">
              <img
                src={meta.icon}
                alt=""
                width={20}
                height={26}
                className="block h-[26px] w-[20px]"
              />
            </div>
            <div className="flex flex-col gap-[2px]">
              <p className="text-[15px] font-semibold leading-normal text-black">
                {data.skin.name}
              </p>
              <p className="text-[13px] font-medium leading-normal text-gray-500">
                {data.skin.description}
              </p>
            </div>
          </div>
        </div>

        <section className="flex w-full flex-col gap-[10px]">
          <button
            type="button"
            onClick={() => setTreatmentsOpen((prev) => !prev)}
            className="flex w-full items-center justify-between"
          >
            <span className="text-[18px] font-bold leading-normal text-black">
              시술 목록
            </span>
            <img
              src={chevronUpIcon}
              alt=""
              width={20}
              height={20}
              className={[
                'block h-[20px] w-[20px] rotate-90 transition-transform',
                treatmentsOpen ? '' : 'rotate-[270deg]',
              ].join(' ')}
            />
          </button>
          {treatmentsOpen ? (
            <div className="flex w-full flex-col gap-[10px]">
              {data.treatments.map((treatment, index) => (
                <TreatmentRow key={index} treatment={treatment} />
              ))}
            </div>
          ) : null}
        </section>

        <section className="flex w-full flex-col gap-[10px]">
          <button
            type="button"
            onClick={() => setCosmeticsOpen((prev) => !prev)}
            className="flex w-full items-center justify-between"
          >
            <span className="text-[18px] font-bold leading-normal text-black">
              화장품 목록
            </span>
            <img
              src={chevronUpIcon}
              alt=""
              width={20}
              height={20}
              className={[
                'block h-[20px] w-[20px] rotate-90 transition-transform',
                cosmeticsOpen ? '' : 'rotate-[270deg]',
              ].join(' ')}
            />
          </button>
          {cosmeticsOpen ? (
            <div className="flex w-full flex-col gap-[10px]">
              {data.cosmetics.map((cosmetic, index) => (
                <CosmeticRow key={index} cosmetic={cosmetic} />
              ))}
            </div>
          ) : null}
        </section>
      </div>

      <div className="fixed bottom-0 left-0 flex w-full justify-center bg-gradient-to-t from-white via-white to-transparent pb-[15px] pt-[25px]">
        <div className="flex w-full max-w-[352px] flex-col gap-[8px] px-[25px]">
          {submitError ? (
            <p className="w-full text-center text-[13px] font-medium text-red-500">
              {submitError}
            </p>
          ) : null}
          <Button variant="brand" disabled={submitting} onClick={handleImport}>
            {submitting ? '등록 중...' : '등록하기'}
          </Button>
        </div>
      </div>

      <HomeIndicator className="h-[25px]" />
    </MobileScreen>
  )
}

function TreatmentRow({ treatment }: { treatment: WhsTreatment }) {
  const comfortable = treatment.reaction === 'COMFORTABLE'

  return (
    <div className="flex h-[60px] w-full items-center justify-between rounded-[10px] border border-gray-200 bg-white px-[16px]">
      <div className="flex flex-col gap-[1px]">
        <p className="text-[15px] font-semibold leading-normal text-black">
          {treatment.treatmentName}
        </p>
        <p className="text-[10px] leading-normal text-gray-700">
          {treatment.treatedOn.replace(/-/g, '.')}
        </p>
      </div>
      <div className="flex items-end gap-[7px]">
        {comfortable ? (
          <img src={whsReactionComfortable} alt="" width={15} height={15} className="block h-[15px] w-[15px]" />
        ) : null}
        <span
          className={[
            'text-[13px] font-medium leading-normal',
            comfortable ? 'text-brand' : 'text-[#e64240]',
          ].join(' ')}
        >
          {treatment.reactionName}
        </span>
      </div>
    </div>
  )
}

function CosmeticRow({ cosmetic }: { cosmetic: WhsCosmetic }) {
  const [imageUrl, setImageUrl] = useState<string>()
  // presigned URL 발급은 됐는데 실제 이미지 파일이 없는 경우(WHS 목데이터 등)도 있어서
  // <img> 로딩 자체가 실패하면 목업 이미지로 넘어가게 별도로 잡는다
  const [imageBroken, setImageBroken] = useState(false)

  useEffect(() => {
    if (!cosmetic.imageObjectKey) return
    let ignore = false
    getDownloadUrl(cosmetic.imageObjectKey)
      .then((url) => {
        if (!ignore) setImageUrl(url)
      })
      .catch(() => {
        if (!ignore) setImageBroken(true)
      })
    return () => {
      ignore = true
    }
  }, [cosmetic.imageObjectKey])

  return (
    <div className="flex h-[100px] w-full items-start gap-[10px] rounded-[10px] border border-gray-200 bg-white p-[10px]">
      <img
        src={imageUrl && !imageBroken ? imageUrl : getProductTypeDefaultImage(cosmetic.productType)}
        onError={() => setImageBroken(true)}
        alt=""
        width={80}
        height={80}
        className="block h-[80px] w-[80px] shrink-0 rounded-[10px] object-cover"
      />
      <div className="flex flex-col gap-[13px]">
        <div className="flex flex-col gap-[2px]">
          <p className="text-[10px] leading-normal text-gray-600">
            {cosmetic.productTypeName}
          </p>
          <p className="text-[15px] font-semibold leading-normal text-black">
            {cosmetic.name}
          </p>
        </div>
        <span className="flex h-[17px] items-center justify-center rounded-[3px] bg-brand/20 px-[8px] text-[10px] leading-none text-brand">
          {getCosmeticCategoryLabel(cosmetic.ingredients)}
        </span>
      </div>
    </div>
  )
}
