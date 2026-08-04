import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { articles, users, activityEvents } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const articleId = parseInt(id)

    // Increment read count
    await db
      .update(articles)
      .set({ readCount: sql`${articles.readCount} + 1` })
      .where(eq(articles.id, articleId))

    // Award XP if logged in
    const session = await getServerSession(authOptions)
    if (session?.user?.id) {
      const userId = parseInt(session.user.id)

      // Award 10 XP
      await db
        .update(users)
        .set({ xp: sql`${users.xp} + 10` })
        .where(eq(users.id, userId))

      // Log activity
      await db.insert(activityEvents).values({
        userId,
        eventType: "article_read",
        entityId: articleId,
        xpDelta: 10,
      })

      // Update streak
      const [user] = await db
        .select({ lastActiveDate: users.lastActiveDate, streak: users.streak })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)

      if (user) {
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
          if (diffDays === 1) {
            newStreak = user.streak + 1
          } else if (diffDays > 1) {
            newStreak = 1
          }
          // diffDays === 0 => same day, no change
        }

        await db
          .update(users)
          .set({ streak: newStreak, lastActiveDate: now })
          .where(eq(users.id, userId))
      }
    }

    return NextResponse.json({ message: "Read recorded" })
  } catch (error) {
    console.error("[Article Read] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
