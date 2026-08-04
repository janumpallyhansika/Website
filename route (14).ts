import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        college: users.college,
        bio: users.bio,
        linkedinUrl: users.linkedinUrl,
        avatarUrl: users.avatarUrl,
        xp: users.xp,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.role, "investor"))

    return NextResponse.json({ investors: rows })
  } catch (error) {
    console.error("[Investors GET] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
