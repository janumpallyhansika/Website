import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { magazines } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

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

    const allowedFields = [
      "title",
      "issueNo",
      "description",
      "coverUrl",
      "pdfUrl",
      "published",
    ]
    const updateFields: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (field in body) updateFields[field] = body[field]
    }

    if (body.published === true) {
      updateFields.publishedAt = new Date()
    }

    const [updated] = await db
      .update(magazines)
      .set(updateFields)
      .where(eq(magazines.id, parseInt(id)))
      .returning()

    if (!updated) {
      return NextResponse.json({ error: "Magazine not found" }, { status: 404 })
    }

    return NextResponse.json({ magazine: updated })
  } catch (error) {
    console.error("[Magazine PATCH] Error:", error)
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

    await db.delete(magazines).where(eq(magazines.id, parseInt(id)))

    return NextResponse.json({ message: "Magazine deleted" })
  } catch (error) {
    console.error("[Magazine DELETE] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
