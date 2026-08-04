import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import {
  users,
  articles,
  submissions,
  founders,
  newsletterSubscribers,
  investorRequests,
  magazines,
  researchPapers,
} from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const [
      totalUsers,
      totalArticles,
      pendingSubmissions,
      approvedFounders,
      newsletterCount,
      investorRequestCount,
      totalMagazines,
      totalResearch,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ count: sql<number>`count(*)` }).from(articles),
      db
        .select({ count: sql<number>`count(*)` })
        .from(submissions)
        .where(eq(submissions.status, "pending")),
      db
        .select({ count: sql<number>`count(*)` })
        .from(founders)
        .where(eq(founders.status, "approved")),
      db
        .select({ count: sql<number>`count(*)` })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.active, true)),
      db.select({ count: sql<number>`count(*)` }).from(investorRequests),
      db.select({ count: sql<number>`count(*)` }).from(magazines),
      db.select({ count: sql<number>`count(*)` }).from(researchPapers),
    ])

    return NextResponse.json({
      stats: {
        totalUsers: Number(totalUsers[0]?.count ?? 0),
        totalArticles: Number(totalArticles[0]?.count ?? 0),
        pendingSubmissions: Number(pendingSubmissions[0]?.count ?? 0),
        approvedFounders: Number(approvedFounders[0]?.count ?? 0),
        newsletterSubscribers: Number(newsletterCount[0]?.count ?? 0),
        investorRequests: Number(investorRequestCount[0]?.count ?? 0),
        totalMagazines: Number(totalMagazines[0]?.count ?? 0),
        totalResearch: Number(totalResearch[0]?.count ?? 0),
      },
    })
  } catch (error) {
    console.error("[Admin Stats] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
