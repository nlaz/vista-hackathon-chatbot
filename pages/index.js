import { useState, useEffect } from "react"
import Image from "next/image"

const Widget = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="absolute w-[100px] h-[100px] rounded-full bg-red-500 bottom-10 right-10"
    >
      <Image src="/drift.png" width={100} height={100} />
    </div>
  )
}

const ChatBox = () => {
  return (
    <div className="absolute w-[500px] h-[400px] bg-red-500 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="flex flex-row justify-between">Chat here</div>
    </div>
  )
}

export default function Home() {
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "k" && event.metaKey) {
        event.preventDefault()
        setShowChat(true)
      }
      if (event.key === "Escape") {
        setShowChat(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div className="border border-red-500 h-screen w-screen relative">
      <iframe src="https://www.drift.com/" className="h-screen w-screen" />
      {showChat ? <ChatBox /> : <Widget onClick={() => setShowChat(true)} />}
    </div>
  )
}
