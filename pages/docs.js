import Link from "next/link"
import Image from "next/image"
import Navigation from "../components/Navigation"

const Document = (props) => {
  const { document } = props
  return (
    <div className="h-[260px] w-[200px] border bg-slate-200 mr-6 rounded p-3">
      {document.title}
    </div>
  )
}

const DocumentList = ({ documentSets }) => {
  return (
    <div className="w-full flex bg-white">
      <div className="w-full">
        <div className="border-b border-slate-200 bg-slate-100">
          <div className="mx-48 max-w-6xl w-full py-8 flex items-center">
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
        <div className="mx-48 max-w-6xl	w-full py-10">
          {documentSets.map((set, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-md font-semibold mb-2">{set.title}</h3>
              <ul className="flex justify-center border p-12 rounded-xl">
                {set.documents.map((document, docIndex) => (
                  <Document key={docIndex} document={document} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DocumentsPage({ documentSets }) {
  return (
    <div className="flex">
      <Navigation />
      <DocumentList documentSets={documentSets} />
    </div>
  )
}

export async function getServerSideProps() {
  const documentSets = [
    {
      title: "Set 1",
      documents: [
        {
          id: 1,
          title: "Document 1",
          url: "http://example.com/document1",
          imageUrl: "http://example.com/document1.jpg",
        },
        {
          id: 2,
          title: "Document 2",
          url: "http://example.com/document2",
          imageUrl: "http://example.com/document2.jpg",
        },
        {
          id: 3,
          title: "Document 3",
          url: "http://example.com/document3",
          imageUrl: "http://example.com/document3.jpg",
        },
        {
          id: 4,
          title: "Document 4",
          url: "http://example.com/document4",
          imageUrl: "http://example.com/document4.jpg",
        },
        {
          id: 4,
          title: "Document 4",
          url: "http://example.com/document4",
          imageUrl: "http://example.com/document4.jpg",
        },
      ],
    },
    {
      title: "Set 2",
      documents: [
        {
          id: 5,
          title: "Document 5",
          url: "http://example.com/document5",
          imageUrl: "http://example.com/document5.jpg",
        },
        {
          id: 6,
          title: "Document 6",
          url: "http://example.com/document6",
          imageUrl: "http://example.com/document6.jpg",
        },
        {
          id: 7,
          title: "Document 7",
          url: "http://example.com/document7",
          imageUrl: "http://example.com/document7.jpg",
        },
        {
          id: 8,
          title: "Document 8",
          url: "http://example.com/document8",
          imageUrl: "http://example.com/document8.jpg",
        },
        {
          id: 8,
          title: "Document 8",
          url: "http://example.com/document8",
          imageUrl: "http://example.com/document8.jpg",
        },
      ],
    },
  ]

  return {
    props: {
      documentSets,
    },
  }
}
