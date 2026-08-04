import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { submissions, articles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
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
    const { action, reviewNote } = body

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be 'approve' or 'reject'" },
        { status: 400 }
      )
    }

    const [submission] = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, parseInt(id)))
      .limit(1)

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const adminId = parseInt(session.user.id)

    if (action === "approve") {
      let slug = slugify(submission.title)
      const [existing] = await db
        .select({ id: articles.id })
        .from(articles)
        .where(eq(articles.slug, slug))
        .limit(1)

      if (existing) {
        slug = `${slug}-${Date.now()}`
      }

      const [article] = await db
        .insert(articles)
        .values({
          slug,
          title: submission.title,
          content: submission.content,
          authorName: submission.authorName || "",
          authorId: submission.userId,
          category: submission.category || "Feature Stories",
          imageUrl: submission.imageUrl,
          published: true,
          publishedAt: new Date(),
        })
        .returning({ id: articles.id })

      await db
        .update(submissions)
        .set({
          status: "approved",
          reviewNote: reviewNote || null,
          reviewedBy: adminId,
          reviewedAt: new Date(),
          articleId: article.id,
        })
        .where(eq(submissions.id, parseInt(id)))

      return NextResponse.json({
        message: "Submission approved and article published",
        articleId: article.id,
      })
    }

    // Reject
    await db
      .update(submissions)
      .set({
        status: "rejected",
        reviewNote: reviewNote || null,
        reviewedBy: adminId,
        reviewedAt: new Date(),
      })
      .where(eq(submissions.id, parseInt(id)))

    return NextResponse.json({ message: "Submission rejected" })
  } catch (error) {
    console.error("[Submission Review] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
