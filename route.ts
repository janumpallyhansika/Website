import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { founders } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

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

    const newStatus = action === "approve" ? "approved" : "rejected"

    const [updated] = await db
      .update(founders)
      .set({ status: newStatus })
      .where(eq(founders.id, parseInt(id)))
      .returning()

    if (!updated) {
      return NextResponse.json({ error: "Founder not found" }, { status: 404 })
    }

    return NextResponse.json({ founder: updated, message: `Founder ${newStatus}` })
  } catch (error) {
    console.error("[Admin Founder PATCH] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
