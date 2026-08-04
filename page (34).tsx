import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { db } from "@/lib/db"
import { researchPapers } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { FileText, ExternalLink } from "lucide-react"

export const dynamic = "force-dynamic"

async function getResearch() {
  return db
    .select()
    .from(researchPapers)
    .where(eq(researchPapers.published, true))
    .orderBy(desc(researchPapers.createdAt))
}

export default async function ResearchPage() {
  const papers = await getResearch()

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#1B2A6B]" style={{ fontFamily: "Georgia, serif" }}>
            Research
          </h1>
          <p className="text-[#D4A017] font-semibold mt-1">
            Academic papers and deep research from ARK&apos;s collegiate network
          </p>
        </div>

        {papers.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={40} className="text-[#1B2A6B]/30 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">No research papers published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {papers.map((paper) => (
              <div
                key={paper.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1B2A6B]/10 flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-[#1B2A6B]" />
                  </div>
                  <div className="flex-1">
                    {paper.domain && (
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-widest bg-[#D4A017] text-[#1B2A6B] rounded-full mb-2">
                        {paper.domain.toUpperCase()}
                      </span>
                    )}
                    <h3 className="font-black text-[#1B2A6B] leading-snug">{paper.title}</h3>
                  </div>
                </div>

                {paper.authors && (
                  <p className="text-xs font-semibold text-gray-500">
                    {paper.authors}
                  </p>
                )}
                {paper.college && (
                  <p className="text-xs text-gray-400">{paper.college}</p>
                )}
                {paper.abstract && (
                  <p className="text-sm text-gray-600 line-clamp-3">{paper.abstract}</p>
                )}

                <div className="flex items-center gap-3 mt-auto pt-2">
                  {paper.pdfUrl && (
                    <a
                      href={paper.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1B2A6B] text-white text-xs font-bold rounded-full hover:bg-[#1B2A6B]/90 transition"
                    >
                      <ExternalLink size={12} />
                      Read Paper
                    </a>
                  )}
                  {paper.citationText && (
                    <span className="text-xs text-gray-400 italic line-clamp-1">
                      {paper.citationText}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
