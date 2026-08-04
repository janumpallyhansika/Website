import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { db } from "@/lib/db"
import { articles, founders, magazines } from "@/lib/db/schema"
import { eq, desc, and, sql } from "drizzle-orm"

export const dynamic = "force-dynamic"

async function getHomeData() {
  const [featuredArticles, spotlightFounders, latestMagazines] = await Promise.all([
    db
      .select()
      .from(articles)
      .where(and(eq(articles.published, true), eq(articles.featured, true)))
      .orderBy(desc(articles.publishedAt))
      .limit(6),
    db
      .select()
      .from(founders)
      .where(eq(founders.status, "approved"))
      .orderBy(desc(founders.createdAt))
      .limit(3),
    db
      .select()
      .from(magazines)
      .where(eq(magazines.published, true))
      .orderBy(desc(magazines.publishedAt))
      .limit(3),
  ])

  return { featuredArticles, spotlightFounders, latestMagazines }
}

export default async function HomePage() {
  const { featuredArticles, spotlightFounders, latestMagazines } = await getHomeData()

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Header />

      {/* Hero stats bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-around gap-4 flex-wrap">
            {[
              { value: "320+", label: "BUILDERS" },
              { value: "54+", label: "PUBLICATIONS" },
              { value: "18+", label: "STARTUPS" },
              { value: "8+", label: "COLLEGES" },
              { value: "12K+", label: "MONTHLY NODE HITS" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-black text-[#D4A017]">{stat.value}</p>
                <p className="text-[10px] tracking-widest text-gray-500 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Featured Builders */}
        {spotlightFounders.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-[#1B2A6B] flex items-center gap-2">
                <span className="text-[#D4A017]">&#9646;</span> Featured Builders
              </h2>
              <Link
                href="/founders"
                className="text-sm font-semibold text-[#1B2A6B] hover:text-[#D4A017] transition"
              >
                View All Builders &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {spotlightFounders.map((founder) => (
                <div
                  key={founder.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-[#1B2A6B]/10 flex items-center justify-center text-xl font-black text-[#1B2A6B] shrink-0">
                      {founder.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1B2A6B]">{founder.name}</h3>
                      <p className="text-xs font-semibold text-[#D4A017] uppercase tracking-wide">
                        {founder.company}
                      </p>
                      {founder.headline && (
                        <p className="text-xs text-gray-500 mt-0.5">{founder.headline}</p>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/founders/${founder.id}`}
                    className="block w-full py-2 text-center text-sm font-semibold bg-gray-100 hover:bg-[#1B2A6B] hover:text-white text-[#1B2A6B] rounded-lg transition"
                  >
                    VIEW BUILDER PROFILE
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trending Chronicles */}
        {featuredArticles.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-[#1B2A6B]">
                Trending Chronicles
              </h2>
              <Link
                href="/chronicles"
                className="text-sm font-semibold text-[#1B2A6B] hover:text-[#D4A017] transition"
              >
                See all
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {featuredArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="min-w-[280px] max-w-[320px] relative rounded-2xl overflow-hidden bg-[#1B2A6B] group shrink-0 hover:scale-[1.02] transition"
                >
                  <div className="h-48 bg-[#1B2A6B]/80 flex items-end p-4">
                    {article.category && (
                      <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-[#1B2A6B] bg-[#D4A017] rounded-full">
                        {article.category.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-bold text-base leading-tight mb-2 group-hover:text-[#D4A017] transition">
                      {article.title}
                    </h3>
                    {article.authorName && (
                      <p className="text-white/60 text-xs">{article.authorName}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* No content state */}
        {featuredArticles.length === 0 && spotlightFounders.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1B2A6B]/10 mb-4">
              <span className="text-3xl font-black text-[#D4A017]">ARK</span>
            </div>
            <h2 className="text-2xl font-bold text-[#1B2A6B] mb-2">
              Welcome to ARK Chronicles
            </h2>
            <p className="text-gray-600 mb-6">
              Content is being set up. Check back soon or explore the platform.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/chronicles"
                className="px-6 py-3 bg-[#1B2A6B] text-white rounded-full font-semibold hover:bg-[#1B2A6B]/90 transition"
              >
                Browse Chronicles
              </Link>
              <Link
                href="/submit-story"
                className="px-6 py-3 border-2 border-[#1B2A6B] text-[#1B2A6B] rounded-full font-semibold hover:bg-[#1B2A6B] hover:text-white transition"
              >
                Submit a Story
              </Link>
            </div>
          </div>
        )}

        {/* Latest Magazines */}
        {latestMagazines.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-[#1B2A6B]">Latest Magazines</h2>
              <Link
                href="/magazines"
                className="text-sm font-semibold text-[#1B2A6B] hover:text-[#D4A017] transition"
              >
                See all
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestMagazines.map((mag) => (
                <div
                  key={mag.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition"
                >
                  <div className="h-48 bg-[#1B2A6B]/10 flex items-center justify-center">
                    <span className="text-4xl font-black text-[#1B2A6B]/30">
                      #{mag.issueNo || "?"}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#1B2A6B] mb-1">{mag.title}</h3>
                    {mag.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">{mag.description}</p>
                    )}
                    {mag.pdfUrl && (
                      <a
                        href={mag.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-sm font-semibold text-[#D4A017] hover:underline"
                      >
                        Read Now &rarr;
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
