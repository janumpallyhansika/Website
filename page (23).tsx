import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ArticleReadTracker } from "@/components/ArticleReadTracker"
import { db } from "@/lib/db"
import { articles } from "@/lib/db/schema"
import { eq, and, not } from "drizzle-orm"

export const dynamic = "force-dynamic"

async function getArticle(slug: string) {
  const [article] = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.published, true)))
    .limit(1)

  return article || null
}

async function getRelatedArticles(category: string | null, currentId: number) {
  if (!category) return []
  const related = await db
    .select()
    .from(articles)
    .where(
      and(
        eq(articles.published, true),
        eq(articles.category, category),
        not(eq(articles.id, currentId))
      )
    )
    .limit(3)
  return related
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const related = await getRelatedArticles(article.category, article.id)

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Header />
      <ArticleReadTracker articleId={article.id} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1B2A6B]">
            Home
          </Link>
          <span>/</span>
          <Link href="/chronicles" className="hover:text-[#1B2A6B]">
            Chronicles
          </Link>
          <span>/</span>
          <span className="text-[#1B2A6B] truncate">{article.title}</span>
        </div>

        {/* Category badge */}
        {article.category && (
          <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest text-[#1B2A6B] bg-[#D4A017] rounded-full mb-4">
            {article.category.toUpperCase()}
          </span>
        )}

        {/* Title */}
        <h1
          className="text-3xl sm:text-4xl font-black text-[#1B2A6B] leading-tight mb-4"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
          {article.authorName && (
            <span className="font-semibold text-[#1B2A6B]">By {article.authorName}</span>
          )}
          {formattedDate && <span>{formattedDate}</span>}
          <span>{article.readCount} reads</span>
        </div>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {article.content}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-gray-200">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white text-[#1B2A6B] text-xs font-semibold rounded-full border border-gray-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-black text-[#1B2A6B] mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/article/${r.slug}`}
                  className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition group"
                >
                  <h3 className="font-bold text-[#1B2A6B] text-sm leading-snug group-hover:text-[#D4A017] transition">
                    {r.title}
                  </h3>
                  {r.authorName && (
                    <p className="text-xs text-gray-400 mt-1">{r.authorName}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
