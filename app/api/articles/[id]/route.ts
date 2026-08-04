import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { articles } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const isNumericId = /^\d+$/.test(id)
    let query

    if (isNumericId) {
      query = db
        .select()
        .from(articles)
        .where(eq(articles.id, parseInt(id)))
        .limit(1)
    } else {
      // Treat as slug
      query = db
        .select()
        .from(articles)
        .where(eq(articles.slug, id))
        .limit(1)
    }

    const [article] = await query

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error("[Article GET] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()

    const { incrementReadCount, ...updateData } = body

    const updateFields: Record<string, unknown> = {}

    if (incrementReadCount) {
      const [updated] = await db
        .update(articles)
        .set({ readCount: sql`${articles.readCount} + 1` })
        .where(eq(articles.id, parseInt(id)))
        .returning()
      return NextResponse.json({ article: updated })
    }

    const allowedFields = [
      "title",
      "excerpt",
      "content",
      "authorName",
      "category",
      "tags",
      "imageUrl",
      "published",
      "featured",
    ]

    for (const field of allowedFields) {
      if (field in updateData) {
        updateFields[field] = updateData[field]
      }
    }

    if (updateData.published === true && !updateData.publishedAt) {
      updateFields.publishedAt = new Date()
    }

    const [updated] = await db
      .update(articles)
      .set(updateFields)
      .where(eq(articles.id, parseInt(id)))
      .returning()

    if (!updated) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json({ article: updated })
  } catch (error) {
    console.error("[Article PATCH] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { id } = await params

    await db.delete(articles).where(eq(articles.id, parseInt(id)))

    return NextResponse.json({ message: "Article deleted" })
  } catch (error) {
    console.error("[Article DELETE] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
