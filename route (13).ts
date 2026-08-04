import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { investorRequests } from "@/lib/db/schema"
import { desc } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const rows = await db
      .select()
      .from(investorRequests)
      .orderBy(desc(investorRequests.createdAt))

    return NextResponse.json({ requests: rows })
  } catch (error) {
    console.error("[Investor Requests GET] Error:", error)
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
    const { investorName, company, startupName, stage, ask, pitch } = body

    if (!startupName || !ask) {
      return NextResponse.json(
        { error: "Startup name and ask are required" },
        { status: 400 }
      )
    }

    const [request_] = await db
      .insert(investorRequests)
      .values({
        userId: parseInt(session.user.id),
        investorName,
        email: session.user.email,
        company,
        startupName,
        stage,
        ask,
        pitch,
        status: "pending",
      })
      .returning()

    return NextResponse.json({ request: request_ }, { status: 201 })
  } catch (error) {
    console.error("[Investor Requests POST] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
