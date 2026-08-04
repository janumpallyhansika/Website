import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { db } from "@/lib/db"
import { founders, articles } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { ExternalLink, ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

async function getFounder(id: number) {
  const [founder] = await db
    .select()
    .from(founders)
    .where(and(eq(founders.id, id), eq(founders.status, "approved")))
    .limit(1)
  return founder || null
}

export default async function FounderProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const founder = await getFounder(Number(id))

  if (!founder) notFound()

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/founders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B2A6B] hover:text-[#D4A017] transition mb-8"
        >
          <ArrowLeft size={16} />
          Back to Founders
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-[#1B2A6B]/10 flex items-center justify-center text-3xl font-black text-[#1B2A6B] shrink-0">
              {founder.name[0]}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-[#1B2A6B]">{founder.name}</h1>
              <p className="text-[#D4A017] font-bold text-lg">{founder.company}</p>
              {founder.headline && (
                <p className="text-gray-600 mt-1">{founder.headline}</p>
              )}
              <div className="flex items-center gap-3 mt-3">
                {founder.strikeRate !== null && founder.strikeRate > 0 && (
                  <span className="px-3 py-1 bg-[#D4A017] text-[#1B2A6B] text-xs font-bold rounded-full">
                    {founder.strikeRate}% strike rate
                  </span>
                )}
                {founder.linkedinUrl && (
                  <a
                    href={founder.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-[#1B2A6B] font-semibold hover:text-[#D4A017] transition"
                  >
                    <ExternalLink size={14} />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

          {founder.bio && (
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-lg font-black text-[#1B2A6B] mb-3">About</h2>
              <p className="text-gray-700 leading-relaxed">{founder.bio}</p>
            </div>
          )}

          {founder.email && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <a
                href={`mailto:${founder.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B2A6B] text-white font-bold rounded-full text-sm hover:bg-[#1B2A6B]/90 transition"
              >
                Get in Touch
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
