import { useState, useEffect, useRef } from "react"
import Image from "next/image"

const URL = "https://www.vistaequitypartners.com/"

const Widget = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer absolute w-[54px] h-[54px] flex justify-center items-center rounded-full drop-shadow bg-gray-800 bottom-10 right-10 text-white"
    >
      <Image src="/sparkles.svg" width={24} height={24} />
    </div>
  )
}

const Message = (props) => {
  const { message } = props
  return (
    <div className="flex mb-4 text-gray-300">
      {message.author === "bot" && (
        <div className="w-[24px] h-[24px] border border-ai-purple rounded-md flex justify-center items-center">
          <Image src="/sparkles.svg" width={12} height={12} />
        </div>
      )}
      {message.author === "user" && (
        <div className="w-[24px] h-[24px] flex justify-center items-center">
          <Image src="/user.svg" width={22} height={22} />
        </div>
      )}
      <div className="ml-3 flex w-full">{message.value}</div>
    </div>
  )
}

const ShadowOverlay = () => {
  return (
    <div className="absolute w-full h-[40px] bottom-0 bg-gradient-to-t from-gray-800 to-transparent pointer-events-none"></div>
  )
}

const MessageHistory = (props) => {
  const { messages, onBack, onNewMessage } = props
  const [query, setQuery] = useState("")

  const endOfMessagesRef = useRef(null)

  const onSubmit = (event) => {
    event.preventDefault()
    onNewMessage(query)
    setQuery("")
  }

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      <div
        onClick={onBack}
        className="mb-3 text-xs flex items-center cursor-pointer"
      >
        <Image src="/arrow-left.svg" width={14} height={14} />
        <span className="ml-[2px] text-gray-400">Ask a question</span>
      </div>
      <div className="flex-1 flex-col overflow-auto relative pb-4">
        {messages.map((message) => (
          <Message key={message.date} message={message} />
        ))}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="relative h-[2px]">
        <ShadowOverlay />
      </div>
      <form onSubmit={onSubmit}>
        <input
          className="w-full text-sm h-[36px] py-2 px-3 resize-none bg-transparent rounded border-gray-700 outline-none border placeholder:text-gray-500"
          placeholder="Ask a question or search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
    </div>
  )
}

const ChatBox = (props) => {
  const { onClose } = props
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState([])

  const showMessageHistory = messages.length > 0

  function onSubmit(event) {
    event.preventDefault()
    onGenerate(query)
    setQuery("")
  }

  function onMessageSubmit(query) {
    onGenerate(query)
  }

  async function onGenerate(query) {
    const newMessage = {
      date: new Date(),
      author: "user",
      value: query,
    }
    const newMessages = [...messages, newMessage]
    setMessages(newMessages)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await response.json()
      const newMessage = {
        author: "bot",
        value: data.result.trim(),
        date: new Date(),
      }
      setMessages((prev) => [...prev, newMessage])
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="absolute text-white w-[500px] h-[400px] bg-gray-800 top-1/2 left-1/2 drop-shadow transform -translate-x-1/2 -translate-y-1/2 p-7 rounded">
      <div className="absolute right-6 top-6 cursor-pointer" onClick={onClose}>
        <Image src="/close.svg" width={14} height={14} />
      </div>
      {showMessageHistory && (
        <MessageHistory
          onBack={() => setMessages([])}
          messages={messages}
          onNewMessage={onMessageSubmit}
        />
      )}
      {!showMessageHistory && (
        <form onSubmit={onSubmit}>
          <input
            placeholder="Ask a question or search..."
            className="w-full h-[45px] py-2 text-lg resize-none bg-transparent border-x-0 border-t-0 border-gray-700 outline-none border placeholder:text-gray-500"
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      )}
    </div>
  )
}

export default function Home() {
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "k" && event.metaKey) {
        event.preventDefault()
        setShowChat((prev) => !prev)
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
    <div className="proxima-nova h-screen w-screen relative">
      <iframe src={URL} className="h-screen w-screen" />
      {showChat ? (
        <ChatBox onClose={() => setShowChat(false)} />
      ) : (
        <Widget onClick={() => setShowChat(true)} />
      )}
    </div>
  )
}
