import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { collegeApplications } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const rows = status
      ? await db
          .select()
          .from(collegeApplications)
          .where(
            eq(
              collegeApplications.status,
              status as "pending" | "approved" | "rejected"
            )
          )
          .orderBy(desc(collegeApplications.createdAt))
      : await db
          .select()
          .from(collegeApplications)
          .orderBy(desc(collegeApplications.createdAt))

    return NextResponse.json({ applications: rows })
  } catch (error) {
    console.error("[College Applications GET] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { collegeName, contactName, email, websiteUrl, proposal } = body

    if (!collegeName || !email) {
      return NextResponse.json(
        { error: "College name and email are required" },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)

    const [application] = await db
      .insert(collegeApplications)
      .values({
        userId: session ? parseInt(session.user.id) : null,
        collegeName,
        contactName,
        email,
        websiteUrl,
        proposal,
        status: "pending",
        verified: false,
      })
      .returning()

    return NextResponse.json({ application }, { status: 201 })
  } catch (error) {
    console.error("[College Applications POST] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
