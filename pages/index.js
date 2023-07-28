import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import Navigation from "../components/Navigation"
import { fetchSets } from "../api"

const Document = (props) => {
  const { document } = props
  return (
    <div className="w-1/5 pr-6">
      <div className="aspect-[5/6] relative border bg-slate-100 rounded-md p-4 my-4 flex flex-col-reverse">
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <div className="mb-3">
            <Image
              src="/file-text.svg"
              width={48}
              height={48}
              className="border border-red-500"
            />
          </div>
        </div>
        <div className="font-mono text-slate-400 text-xs whitespace-normal break-words">
          {document.url}
        </div>
      </div>
    </div>
  )
}

const DocumentList = ({ sets }) => {
  const [selectedSet, setSelectedSet] = useState()
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
              <button className="text-white rounded-lg bg-ai-purple px-3 py-[6px] flex items-center">
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
                    {set.documents.slice(0, 5).map((document, docIndex) => (
                      <Document key={docIndex} document={document} />
                    ))}
                  </ul>
                </div>
              ))}
            {selectedSet && (
              <div className="flex flex-wrap border rounded-xl px-12 py-8">
                {selectedSet.documents.map((document, docIndex) => (
                  <Document key={docIndex} document={document} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DocumentsPage({ sets }) {
  return (
    <div className="flex bg-white h-screen">
      <Navigation />
      <DocumentList sets={sets} />
    </div>
  )
}

export async function getServerSideProps() {
  const sets = await fetchSets()

  return {
    props: { sets: [] },
  }
}
