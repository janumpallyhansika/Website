import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { submissions } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const mine = searchParams.get("mine") === "true"
    const status = searchParams.get("status")
    const limit = Math.min(100, Number(searchParams.get("limit") || "50"))

    // User fetching their own submissions
    if (mine) {
      if (!session) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }
      const rows = await db
        .select()
        .from(submissions)
        .where(eq(submissions.userId, parseInt(session.user.id)))
        .orderBy(desc(submissions.createdAt))
        .limit(limit)
      return NextResponse.json({ submissions: rows })
    }

    // Admin: list all, optionally filtered by status
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const conditions = []
    if (status) {
      conditions.push(eq(submissions.status, status as "pending" | "approved" | "rejected"))
    }

    const rows = await db
      .select()
      .from(submissions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(submissions.createdAt))
      .limit(limit)

    return NextResponse.json({ submissions: rows })
  } catch (error) {
    console.error("[Submissions GET] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { title, authorName, email, college, linkedinUrl, category, content, imageUrl } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }
    if (!authorName || !email) {
      return NextResponse.json({ error: "Author name and email are required" }, { status: 400 })
    }

    const [submission] = await db
      .insert(submissions)
      .values({
        userId: session ? parseInt(session.user.id) : null,
        title,
        authorName,
        email,
        college,
        linkedinUrl,
        category,
        content,
        imageUrl,
        status: "pending",
      })
      .returning()

    // Award XP to logged-in submitters
    if (session?.user?.id) {
      const userId = parseInt(session.user.id)
      await db.insert(activityEvents).values({
        userId,
        eventType: "submit_story",
        entityId: submission.id,
        xpDelta: 20,
      })
      await db
        .update(users)
        .set({ xp: sql`${users.xp} + 20` })
        .where(eq(users.id, userId))
    }

    return NextResponse.json({ submission }, { status: 201 })
  } catch (error) {
    console.error("[Submissions POST] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
