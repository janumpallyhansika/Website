import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { founders } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const [founder] = await db
      .select()
      .from(founders)
      .where(eq(founders.id, parseInt(id)))
      .limit(1)

    if (!founder) {
      return NextResponse.json({ error: "Founder not found" }, { status: 404 })
    }

    return NextResponse.json({ founder })
  } catch (error) {
    console.error("[Founder GET] Error:", error)
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

    const allowedFields = [
      "name",
      "company",
      "headline",
      "bio",
      "photoUrl",
      "linkedinUrl",
      "email",
      "status",
      "strikeRate",
    ]

    const updateFields: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (field in body) {
        updateFields[field] = body[field]
      }
    }

    const [updated] = await db
      .update(founders)
      .set(updateFields)
      .where(eq(founders.id, parseInt(id)))
      .returning()

    if (!updated) {
      return NextResponse.json({ error: "Founder not found" }, { status: 404 })
    }

    return NextResponse.json({ founder: updated })
  } catch (error) {
    console.error("[Founder PATCH] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
