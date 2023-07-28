import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Navigation from "../components/Navigation"

const Message = (props) => {
  const { message } = props
  return (
    <div
      className={`flex justify-center border-b py-8 ${
        message.author === "bot" ? "bg-slate-100" : "bg-white"
      }`}
    >
      <div className="max-w-2xl w-full flex text-slate-800">
        {message.author === "bot" && (
          <div className="w-[30px] h-[30px] border border-ai-purple rounded-md flex justify-center items-center">
            <Image src="/sparkles.svg" width={16} height={16} />
          </div>
        )}
        {message.author === "user" && (
          <div className="w-[30px] h-[30px] flex justify-center items-center">
            <Image src="/user.svg" width={30} height={30} />
          </div>
        )}
        <div className="ml-5 flex w-full mt-1">{message.value}</div>
      </div>
    </div>
  )
}

const MessageHistory = (props) => {
  const { messages, onBack } = props
  const [query, setQuery] = useState("")

  const endOfMessagesRef = useRef(null)

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="flex flex-col flex-1">
      {messages.length > 0 && (
        <div className="flex-1 flex-col overflow-auto relative pb-4">
          {messages.map((message) => (
            <Message key={message.date} message={message} />
          ))}
          <div ref={endOfMessagesRef} />
        </div>
      )}
      {messages.length === 0 && (
        <div className="flex-1 flex justify-center items-center">
          <div className="flex items-center pb-20">
            <Image src="/sparkles.svg" width={32} height={32} />
            <div className="ml-3 font-bold text-3xl">DriftAI</div>
          </div>
        </div>
      )}
    </div>
  )
}

const ChatHeader = (props) => {
  const { showSetTypeInput } = props

  return (
    <div className="border-b py-6">
      <div className="flex items-center justify-center">
        <div className="w-[240px]">
          <div className="mb-1 text-xs text-slate-400 text-center">
            Choose a model
          </div>
          <select className="w-[240px] border border-slate-300 px-3 py-[4px] rounded-md outline-0">
            <option>Set 1</option>
          </select>
        </div>
      </div>
    </div>
  )
}

const ChatBox = () => {
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState([])

  const showSetTypeInput = messages.length > 0

  const onSubmit = (event) => {
    event.preventDefault()
    onGenerate(query)
    setQuery("")
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
    <div className="flex w-screen justify-center h-screen flex flex-col bg-white">
      <ChatHeader showSetTypeInput={showSetTypeInput} />
      <MessageHistory onBack={() => setMessages([])} messages={messages} />
      <div className="flex justify-center p-6 pt-8 bg-white">
        <form onSubmit={onSubmit} className="max-w-2xl w-full">
          <input
            placeholder="Send a message..."
            className="w-full h-[45px] py-4 drop-shadwow-sm bg-white border rounded-lg px-4 outline-0 placeholder:text-slate-400"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <div className="text-sm text-center mt-[8px] text-slate-400">
            This AI may produce inaccurate information about products, people,
            places, or facts.
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ChatPage({ documentSets }) {
  return (
    <div className="flex">
      <Navigation />
      <ChatBox />
    </div>
  )
}
