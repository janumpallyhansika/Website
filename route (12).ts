import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { founders } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "approved"
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100)

    const rows = await db
      .select()
      .from(founders)
      .where(eq(founders.status, status as "pending" | "approved" | "rejected"))
      .orderBy(desc(founders.createdAt))
      .limit(limit)

    return NextResponse.json({ founders: rows })
  } catch (error) {
    console.error("[Founders GET] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { name, company, headline, bio, photoUrl, linkedinUrl, email } = body

    if (!name || !company) {
      return NextResponse.json(
        { error: "Name and company are required" },
        { status: 400 }
      )
    }

    const [founder] = await db
      .insert(founders)
      .values({
        userId: parseInt(session.user.id),
        name,
        company,
        headline,
        bio,
        photoUrl,
        linkedinUrl,
        email: email || session.user.email,
        status: "pending",
      })
      .returning()

    return NextResponse.json({ founder }, { status: 201 })
  } catch (error) {
    console.error("[Founders POST] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
