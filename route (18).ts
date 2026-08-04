import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { researchPapers } from "@/lib/db/schema"
import { eq, ilike, and, desc } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get("published")
    const domain = searchParams.get("domain")
    const college = searchParams.get("college")

    const conditions = []

    if (published === "true") {
      conditions.push(eq(researchPapers.published, true))
    }

    if (domain) {
      conditions.push(ilike(researchPapers.domain, `%${domain}%`))
    }

    if (college) {
      conditions.push(ilike(researchPapers.college, `%${college}%`))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const rows = await db
      .select()
      .from(researchPapers)
      .where(whereClause)
      .orderBy(desc(researchPapers.createdAt))

    return NextResponse.json({ papers: rows })
  } catch (error) {
    console.error("[Research GET] Error:", error)
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
    const { title, authors, abstract, domain, college, citationText, pdfUrl, published } =
      body

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const [paper] = await db
      .insert(researchPapers)
      .values({
        title,
        authors,
        abstract,
        domain,
        college,
        citationText,
        pdfUrl,
        published: published ?? false,
      })
      .returning()

    return NextResponse.json({ paper }, { status: 201 })
  } catch (error) {
    console.error("[Research POST] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
