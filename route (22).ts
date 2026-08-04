import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userId = parseInt(session.user.id)

    const [user] = await db
      .select({ lastActiveDate: users.lastActiveDate, streak: users.streak })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const lastActive = user.lastActiveDate
      ? new Date(
          user.lastActiveDate.getFullYear(),
          user.lastActiveDate.getMonth(),
          user.lastActiveDate.getDate()
        )
      : null

    let newStreak = user.streak

    if (!lastActive) {
      newStreak = 1
    } else {
      const diffDays = Math.floor(
        (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (diffDays === 0) {
        // Same day, no change
        return NextResponse.json({ streak: user.streak, message: "Already updated today" })
      } else if (diffDays === 1) {
        newStreak = user.streak + 1
      } else {
        newStreak = 1
      }
    }

    await db
      .update(users)
      .set({ streak: newStreak, lastActiveDate: now })
      .where(eq(users.id, userId))

    return NextResponse.json({ streak: newStreak, message: "Streak updated" })
  } catch (error) {
    console.error("[User Streak POST] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
