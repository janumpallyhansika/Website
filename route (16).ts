import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { magazines } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get("published")
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50)

    const conditions = []
    if (published === "true") {
      conditions.push(eq(magazines.published, true))
    }

    const rows = await db
      .select()
      .from(magazines)
      .where(conditions.length > 0 ? conditions[0] : undefined)
      .orderBy(desc(magazines.publishedAt), desc(magazines.createdAt))
      .limit(limit)

    return NextResponse.json({ magazines: rows })
  } catch (error) {
    console.error("[Magazines GET] Error:", error)
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
    const { title, issueNo, description, coverUrl, pdfUrl, published } = body

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const [magazine] = await db
      .insert(magazines)
      .values({
        title,
        issueNo: issueNo ? parseInt(issueNo) : null,
        description,
        coverUrl,
        pdfUrl,
        published: published ?? false,
        publishedAt: published ? new Date() : null,
      })
      .returning()

    return NextResponse.json({ magazine }, { status: 201 })
  } catch (error) {
    console.error("[Magazines POST] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
