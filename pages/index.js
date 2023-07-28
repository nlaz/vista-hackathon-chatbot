import { useEffect, useState } from "react"
import Image from "next/image"
import Navigation from "../components/Navigation"
import { fetchSets, removeDocument } from "../api"

const baseurl1 = "https://www.pinecone.io"
const baseurl2 = "https://www.datadoghq.com"

const Document = (props) => {
  const { document, onRemove } = props
  const [showRemove, setShowRemove] = useState(false)

  const openInNewTab = () => {
    const win = window.open(document.url, "_blank")
    win.focus()
  }

  const confirmRemove = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm("Are you sure you want to remove this file?")) {
      onRemove(document.document_id)
      removeDocument(document.document_id)
    }
  }

  return (
    <div
      className="w-1/4 pr-6"
      onMouseEnter={() => setShowRemove(true)}
      onMouseLeave={() => setShowRemove(false)}
    >
      <div className="my-4">
        <div
          className="aspect-[6/5] relative border bg-slate-100 rounded-md flex flex-col-reverse cursor-pointer"
          onClick={openInNewTab}
        >
          <Image
            src={document.img ? document.img : "/file-text.svg"}
            layout="fill"
            className="border border-red-500"
            objectFit="cover"
          />
          {showRemove && onRemove && (
            <div
              className="absolute top-1 z-10 right-1 p-2"
              onClick={confirmRemove}
            >
              <Image src="/x.svg" width={16} height={16} />
            </div>
          )}
        </div>
        <div className="font-mono text-slate-400 text-xs whitespace-normal break-words mt-2">
          {document.url.replace(baseurl1, "").replace(baseurl2, "")}
        </div>
      </div>
    </div>
  )
}

const DocumentList = (props) => {
  const [sets, setSets] = useState(props.sets)
  const [selectedSet, setSelectedSet] = useState()

  const onRemoveDocument = (document_id) => {
    setSets((prev) =>
      prev.map((s) => {
        if (s.id === selectedSet.id) {
          const newDocuments = s.documents.filter(
            (d) => d.document_id !== document_id
          )

          return { ...s, documents: newDocuments }
        }
        return s
      })
    )
    setSelectedSet((prev) => {
      const newDocuments = prev.documents.filter(
        (d) => d.document_id !== document_id
      )
      return { ...prev, documents: newDocuments }
    })
  }

  return (
    <div className="w-full flex bg-white h-screen overflow-auto">
      <div className="w-full border-width-4 flex flex-col">
        <div className="border-b border-slate-200 bg-slate-100 flex items-center justify-center">
          <div className="justify-center max-w-6xl w-full py-8 flex items-center">
            <div>
              <Image src="/sparkles.svg" width={38} height={38} />
            </div>
            <div className="ml-3 flex-1">
              <h2 className="text-lg font-bold">Chat Documents</h2>
              <div className="text-gray-500">
                Upload documents or add links to your knowlege base to train
                your chat bots.
              </div>
            </div>
            <div>
              <button
                className="text-white rounded-lg bg-ai-purple px-3 py-[6px] flex items-center"
                onClick={props.onShowModal}
              >
                <Image src="/plus.svg" width={18} height={18} />
                <span className="ml-1 mr-2">Add Documents</span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center flex-1">
          <div className="justify-center max-w-6xl w-full py-10 flex flex-1 flex-col">
            {sets.length === 0 && (
              <div className="flex-1 flex justify-center items-center">
                <div className="flex items-center pb-20">
                  <Image src="/sparkles.svg" width={32} height={32} />
                  <div className="ml-3 font-bold text-3xl">DriftAI</div>
                </div>
              </div>
            )}

            {!selectedSet &&
              sets?.map((set, index) => (
                <div
                  key={index}
                  className="mb-6 cursor-pointer"
                  onClick={() => setSelectedSet(set)}
                >
                  <ul className="flex hover:bg-slate-50 border rounded-xl px-12 py-8">
                    {set.documents.slice(0, 4).map((document, docIndex) => (
                      <Document key={docIndex} document={document} />
                    ))}
                  </ul>
                </div>
              ))}
            {selectedSet && (
              <div className="flex flex-wrap border rounded-xl px-12 py-8">
                {selectedSet.documents.map((document, docIndex) => (
                  <Document
                    key={docIndex}
                    document={document}
                    onRemove={onRemoveDocument}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const trimUrl = (url) => {
  const regex = /^(?:https?:\/\/)?/i
  const newUrl = url.replace(regex, "")
  return newUrl
}

const randomString = () => {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz"
  let result = ""
  for (let i = 8; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

const Modal = (props) => {
  const { onClose } = props
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async () => {
    setIsLoading(true)
    const res = await fetch("http://0.0.0.0:8080/v0/sets/docs/domainUpload", {
      method: "POST",
      body: JSON.stringify({
        url: trimUrl(url),
        title,
        set_id: randomString(),
        org_id: 1,
        document_type: "webpage",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json()
    setIsLoading(false)
    onClose()
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div className="absolute inset-0 flex justify-center items-center bg-white/[.2] z-10">
      <div className="border w-[420px] h-[500px] bg-white rounded-2xl drop-shadow-lg z-10 overflow-hidden flex flex-col">
        <div className="h-[50px] w-full bg-ai-purple flex justify-center items-center">
          <Image src="/sparkles-white.svg" width={28} height={28} />
        </div>
        <div
          className="absolute right-4 top-4 cursor-pointer"
          onClick={onClose}
        >
          <Image src="/x.svg" width={18} height={18} />
        </div>
        <div className="p-6 flex-1">
          <div className="flex items-center justify-center mb-6">
            <Image src="/link.svg" width={14} height={14} />
            <div className="text-sm ml-1 text-slate-800">Web Scraping</div>
          </div>
          <div className="text-sm font-bold mb-1">Collection Title</div>
          <input
            className="border px-3 py-2 text-sm rounded-md w-full"
            placeholder="Add a title..."
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="text-sm font-bold mb-1 mt-4">Url</div>
          <input
            className="border px-3 py-2 text-sm rounded-md w-full"
            placeholder="Add a url..."
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="border-red-500 p-6">
          <div
            className="bg-ai-purple rounded-lg py-2 px-3 flex text-white justify-center items-center cursor-pointer"
            onClick={onSubmit}
          >
            Create Collection
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DocumentsPage({ sets }) {
  const [showModal, setShowModal] = useState(true)
  return (
    <div className="flex bg-white h-screen relative">
      <Navigation />
      <DocumentList sets={sets} onShowModal={setShowModal} />
      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </div>
  )
}

export async function getServerSideProps() {
  try {
    const sets = await fetchSets()

    return {
      props: { sets: sets || [] },
    }
  } catch (error) {
    return { props: { sets: [] } }
  }
}
