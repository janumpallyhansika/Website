"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Search } from "lucide-react"

const CATEGORIES = [
  "ALL",
  "FEATURE STORIES",
  "FOUNDER STORIES",
  "RESEARCH STORIES",
  "AI ARTICLES",
  "INNOVATION REPORTS",
  "EDITORIALS",
]

const TAGS = ["#All", "#SaaS", "#ClimateTech", "#DeepTech", "#AI Agents", "#Capital", "#Execution"]

type Article = {
  id: number
  slug: string
  title: string
  excerpt: string | null
  authorName: string | null
  category: string | null
  tags: string[] | null
  imageUrl: string | null
  publishedAt: string | null
  readCount: number
}

export default function ChroniclesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("ALL")
  const [tag, setTag] = useState("#All")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        published: "true",
        page: String(page),
        limit: "12",
      })
      if (search) params.set("search", search)
      if (category !== "ALL") params.set("category", category)

      const res = await fetch(`/api/articles?${params}`)
      const data = await res.json()
      setArticles(data.articles || [])
      setTotalPages(data.pagination?.totalPages || 1)
    } catch {
      setArticles([])
    } finally {
      setLoading(false)
    }
  }, [search, category, page])

  useEffect(() => {
    const timeout = setTimeout(fetchArticles, 300)
    return () => clearTimeout(timeout)
  }, [fetchArticles])

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Header />

      {/* Live ticker */}
      <div className="bg-[#1B2A6B] text-white py-2.5 overflow-hidden">
        <div className="flex items-center gap-6 px-4 text-xs">
          <span className="flex items-center gap-2 shrink-0">
            <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">
              LIVE
            </span>
          </span>
          <span className="text-white/80">
            CHRONICLES: Deep-dive startup analysis, regional tech briefs, and collegiate columns.
          </span>
          <span className="text-white/60 shrink-0">
            INTELLIGENCE REPORT: Track active builder indices across ARK nodes.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Title + Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-black text-[#1B2A6B]" style={{ fontFamily: "Georgia, serif" }}>
              The Chronicles
            </h1>
            <p className="text-[#D4A017] font-semibold">Deep Stories &amp; Analysis</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by title or author..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B]"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-4">
          <p className="text-xs tracking-widest text-gray-400 font-semibold mb-2">
            FILTER BY CATEGORY
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1) }}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide border transition ${
                  category === cat
                    ? "bg-[#1B2A6B] text-white border-[#1B2A6B]"
                    : "bg-white text-[#1B2A6B] border-gray-200 hover:border-[#1B2A6B]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tag filter */}
        <div className="mb-8">
          <p className="text-xs tracking-widest text-gray-400 font-semibold mb-2">
            FILTER BY TAG
          </p>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
                  tag === t
                    ? "bg-[#D4A017] text-[#1B2A6B] border-[#D4A017]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#D4A017]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Articles grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-5 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No articles found.</p>
            <button
              onClick={() => { setSearch(""); setCategory("ALL"); setTag("#All") }}
              className="mt-4 px-6 py-2 bg-[#1B2A6B] text-white rounded-full text-sm font-semibold"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition group"
              >
                <div className="h-52 bg-[#1B2A6B]/10 relative flex items-end p-4">
                  {article.category && (
                    <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-[#1B2A6B] bg-[#D4A017] rounded-full z-10">
                      {article.category.toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#1B2A6B] text-base leading-snug mb-2 group-hover:text-[#D4A017] transition line-clamp-2">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{article.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{article.authorName || "ARK Editorial"}</span>
                    <span>{article.readCount} reads</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold disabled:opacity-40 hover:border-[#1B2A6B] transition"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold disabled:opacity-40 hover:border-[#1B2A6B] transition"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
