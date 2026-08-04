import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { FounderApplyButton } from "@/components/FounderApplyButton"
import { db } from "@/lib/db"
import { founders } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

export const dynamic = "force-dynamic"

async function getFounders() {
  return db
    .select()
    .from(founders)
    .where(eq(founders.status, "approved"))
    .orderBy(desc(founders.createdAt))
}

export default async function FoundersPage() {
  const approvedFounders = await getFounders()

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-4xl font-black text-[#1B2A6B]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Founder Spotlights
            </h1>
            <p className="text-[#D4A017] font-semibold mt-1">
              Meet the builders redefining India&apos;s tech landscape
            </p>
          </div>
          <FounderApplyButton />
        </div>

        {approvedFounders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No founder profiles available yet. Be the first!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedFounders.map((founder) => (
              <div
                key={founder.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#1B2A6B]/10 flex items-center justify-center text-2xl font-black text-[#1B2A6B] shrink-0">
                    {founder.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#1B2A6B] text-lg">{founder.name}</h3>
                    <p className="text-sm font-semibold text-[#D4A017]">{founder.company}</p>
                    {founder.headline && (
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                        {founder.headline}
                      </p>
                    )}
                  </div>
                </div>

                {founder.bio && (
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">{founder.bio}</p>
                )}

                <div className="flex items-center gap-2 mb-4">
                  {founder.strikeRate !== null && founder.strikeRate > 0 && (
                    <span className="px-3 py-1 bg-[#D4A017] text-[#1B2A6B] text-xs font-bold rounded-full">
                      {founder.strikeRate}% strike rate
                    </span>
                  )}
                </div>

                <Link
                  href={`/founders/${founder.id}`}
                  className="block w-full py-2.5 text-center text-sm font-bold bg-gray-100 hover:bg-[#1B2A6B] hover:text-white text-[#1B2A6B] rounded-xl transition"
                >
                  VIEW BUILDER PROFILE
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
