import Link from "next/link"
import Image from "next/image"

const Navigation = () => {
  return (
    <div className="w-[48px] fixed z-10 drop-shadow-sm bg-white border-r h-screen flex flex-col items-center">
      <div className="flex justify-center items-center w-[48px] h-[86px] py-6 bg-ai-purple">
        <Image src="/drift.svg" width={24} height={24} />
      </div>
      <div className="flex flex-col items-center flex-1">
        <Link href="/chat">
          <div className="px-3 py-5 hover:bg-slate-100 cursor-pointer">
            <Image src="/sparkles.svg" width={24} height={24} />
          </div>
        </Link>
        <Link href="/">
          <div className="px-3 py-5 hover:bg-slate-100 cursor-pointer">
            <Image src="/document.svg" width={24} height={24} />
          </div>
        </Link>
      </div>

      <div className="flex flex-col items-center my-5 w-[28px] h-[28px] border border-2 border-white rounded-full">
        <Image src="/user.svg" width={28} height={28} />
      </div>
    </div>
  )
}

export default Navigation
