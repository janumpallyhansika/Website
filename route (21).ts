import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { users, userBadges, badges } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userId = parseInt(session.user.id)

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        college: users.college,
        role: users.role,
        xp: users.xp,
        streak: users.streak,
        lastActiveDate: users.lastActiveDate,
        linkedinUrl: users.linkedinUrl,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Fetch badges
    const earnedBadges = await db
      .select({
        id: badges.id,
        code: badges.code,
        name: badges.name,
        description: badges.description,
        icon: badges.icon,
        earnedAt: userBadges.earnedAt,
      })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId))

    return NextResponse.json({ user, badges: earnedBadges })
  } catch (error) {
    console.error("[User Profile GET] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userId = parseInt(session.user.id)
    const body = await request.json()

    const allowedFields = ["name", "bio", "college", "linkedinUrl", "avatarUrl"]
    const updateFields: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (field in body) updateFields[field] = body[field]
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    const [updated] = await db
      .update(users)
      .set(updateFields)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        college: users.college,
        bio: users.bio,
        linkedinUrl: users.linkedinUrl,
        avatarUrl: users.avatarUrl,
      })

    return NextResponse.json({ user: updated })
  } catch (error) {
    console.error("[User Profile PATCH] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
