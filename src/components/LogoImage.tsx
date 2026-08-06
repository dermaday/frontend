import imageIcon from '../assets/icons/image.svg'

/** Figma `로고 이미지` (node 5:3075) */
export default function LogoImage() {
  return (
    <div className="flex h-[118px] w-full shrink-0 items-start justify-end">
      <div className="flex h-[118px] w-[118px] items-center justify-center bg-[#d9d9d9]">
        <img
          src={imageIcon}
          alt=""
          width={48}
          height={48}
          className="block h-[48px] w-[48px]"
        />
      </div>
    </div>
  )
}
