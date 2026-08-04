import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { desc, asc } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const sort = searchParams.get("sort")

    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        college: users.college,
        role: users.role,
        xp: users.xp,
        streak: users.streak,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(sort === "xp" ? desc(users.xp) : desc(users.createdAt))

    return NextResponse.json({ users: rows })
  } catch (error) {
    console.error("[Admin Users GET] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { userId, role } = body

    const validRoles = ["member", "founder", "investor", "journalist", "admin"]
    if (!userId || !validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Valid userId and role are required" },
        { status: 400 }
      )
    }

    const { eq } = await import("drizzle-orm")
    const [updated] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, parseInt(userId)))
      .returning({ id: users.id, role: users.role })

    return NextResponse.json({ user: updated })
  } catch (error) {
    console.error("[Admin Users PATCH] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
