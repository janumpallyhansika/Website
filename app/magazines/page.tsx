import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { db } from "@/lib/db"
import { magazines } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { BookOpen } from "lucide-react"

export const dynamic = "force-dynamic"

async function getMagazines() {
  return db
    .select()
    .from(magazines)
    .where(eq(magazines.published, true))
    .orderBy(desc(magazines.publishedAt))
}

export default async function MagazinesPage() {
  const allMagazines = await getMagazines()

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#1B2A6B]" style={{ fontFamily: "Georgia, serif" }}>
            ARK Magazines
          </h1>
          <p className="text-[#D4A017] font-semibold mt-1">
            Curated issues packed with insights from India&apos;s builder ecosystem
          </p>
        </div>

        {allMagazines.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={40} className="text-[#1B2A6B]/30 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">No magazines published yet.</p>
            <p className="text-gray-400 text-sm mt-1">Check back soon for the first issue.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allMagazines.map((mag) => (
              <div
                key={mag.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col"
              >
                <div className="h-56 bg-[#1B2A6B] flex items-center justify-center relative">
                  {mag.coverUrl ? (
                    <img
                      src={mag.coverUrl}
                      alt={mag.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                  ) : (
                    <div className="text-center text-white">
                      <BookOpen size={40} className="mx-auto mb-2 opacity-50" />
                      <p className="text-4xl font-black text-[#D4A017]">
                        #{mag.issueNo || "—"}
                      </p>
                    </div>
                  )}
                  {mag.issueNo && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-[#D4A017] text-[#1B2A6B] text-xs font-bold rounded-full">
                      ISSUE {mag.issueNo}
                    </span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-black text-[#1B2A6B] text-lg mb-1">{mag.title}</h3>
                  {mag.publishedAt && (
                    <p className="text-xs text-gray-400 mb-2">
                      {new Date(mag.publishedAt).toLocaleDateString("en-IN", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                  {mag.description && (
                    <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
                      {mag.description}
                    </p>
                  )}
                  {mag.pdfUrl ? (
                    <a
                      href={mag.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-2.5 text-center bg-[#1B2A6B] text-white font-bold text-sm rounded-xl hover:bg-[#1B2A6B]/90 transition"
                    >
                      Read Now
                    </a>
                  ) : (
                    <span className="block w-full py-2.5 text-center bg-gray-100 text-gray-400 font-bold text-sm rounded-xl cursor-not-allowed">
                      Coming Soon
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
