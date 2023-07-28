import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Navigation from "../components/Navigation"
import { fetchSets } from "../api"
import nl2br from "react-newline-to-break"

const Message = (props) => {
  const { message } = props

  const openInNewTab = (url) => {
    const win = window.open(url, "_blank")
    win.focus()
  }

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
        <div className="ml-5 w-full mt-1">
          {nl2br(message.value)}
          {message.sources?.map((s, i) => (
            <span
              key={i}
              className="cursor-pointer text-blue-700 mt-[6px] mr-1 hover:text-blue-900"
              onClick={() => openInNewTab(s)}
            >
              [{i}]
            </span>
          ))}
        </div>
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
    <div className="flex flex-col flex-1 overflow-auto">
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
  const { showSetTypeInput, sets, onChange, activeSetId } = props

  return (
    <div className="border-b py-6">
      <div className="flex items-center justify-center">
        {!showSetTypeInput && (
          <div className="flex items-center text-sm text-slate-800">
            <Image src="/sparkles.svg" width={14} height={14} />
            <span className="ml-1">Context: Set - {activeSetId}</span>
          </div>
        )}
        {showSetTypeInput && (
          <div className="w-[240px]">
            <div className="mb-1 text-xs text-slate-400 text-center">
              Choose a context
            </div>
            <select
              onChange={(event) => onChange(event.target.value)}
              className="w-[240px] border border-slate-300 px-3 py-[4px] rounded-md outline-0"
            >
              {sets.map((set) => (
                <option key={set.set_id} value={set.set_id}>
                  Set - {set.set_id}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  )
}

const unique = (arr) => [...new Set(arr)]

const ChatBox = ({ sets }) => {
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState([])
  const [setId, setSetId] = useState(sets[0]?.set_id)

  const showSetTypeInput = messages.length === 0

  const onSubmit = (event) => {
    event.preventDefault()
    onGenerate(query)
    setQuery("")
  }

  const onChangeSet = (set) => setSetId(set)

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
        body: JSON.stringify({
          messages: newMessages,
          set_id: setId,
          is_confident: true,
        }),
      })
      const data = await response.json()
      const newMessage = {
        author: "bot",
        value: data.result?.chat_response?.trim(),
        date: new Date(),
        sources: unique(data.result?.sources),
      }
      setMessages((prev) => [...prev, newMessage])
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="flex w-screen justify-center h-screen flex flex-col bg-white">
      <ChatHeader
        showSetTypeInput={showSetTypeInput}
        sets={sets}
        onChange={onChangeSet}
        activeSetId={setId}
      />
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
            DriftAI may produce inaccurate information about products, people,
            places, or facts.
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ChatPage({ sets }) {
  console.log("sets", sets)
  return (
    <div className="flex">
      <Navigation />
      <ChatBox sets={sets} />
    </div>
  )
}

export async function getServerSideProps() {
  const sets = await fetchSets()

  return {
    props: { sets: sets || [] },
  }
}
