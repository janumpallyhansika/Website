import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { articles, users } from "@/lib/db/schema"
import { eq, ilike, and, desc, sql, or, inArray } from "drizzle-orm"

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")
    const published = searchParams.get("published")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50)
    const offset = (page - 1) * limit

    const conditions = []

    if (published === "true") {
      conditions.push(eq(articles.published, true))
    }

    if (featured === "true") {
      conditions.push(eq(articles.featured, true))
    }

    if (category && category !== "all" && category !== "ALL") {
      conditions.push(ilike(articles.category, `%${category}%`))
    }

    if (search) {
      conditions.push(
        or(
          ilike(articles.title, `%${search}%`),
          ilike(articles.authorName, `%${search}%`)
        )
      )
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(articles)
        .where(whereClause)
        .orderBy(desc(articles.publishedAt), desc(articles.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(articles)
        .where(whereClause),
    ])

    const total = Number(countResult[0]?.count ?? 0)

    return NextResponse.json({
      articles: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[Articles GET] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      excerpt,
      content,
      authorName,
      authorId,
      category,
      tags,
      imageUrl,
      published,
      featured,
    } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    let slug = slugify(title)
    // Check uniqueness
    const [existing] = await db
      .select({ id: articles.id })
      .from(articles)
      .where(eq(articles.slug, slug))
      .limit(1)

    if (existing) {
      slug = `${slug}-${Date.now()}`
    }

    const [article] = await db
      .insert(articles)
      .values({
        slug,
        title,
        excerpt,
        content,
        authorName,
        authorId: authorId ? parseInt(authorId) : null,
        category,
        tags: tags || [],
        imageUrl,
        published: published ?? false,
        featured: featured ?? false,
        publishedAt: published ? new Date() : null,
      })
      .returning()

    return NextResponse.json({ article }, { status: 201 })
  } catch (error) {
    console.error("[Articles POST] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
