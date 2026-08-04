import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { newsletterSubscribers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const [existing] = await db
      .select({ id: newsletterSubscribers.id, active: newsletterSubscribers.active })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, normalizedEmail))
      .limit(1)

    if (existing) {
      if (existing.active) {
        return NextResponse.json(
          { message: "You are already subscribed!" },
          { status: 200 }
        )
      }
      // Re-activate
      await db
        .update(newsletterSubscribers)
        .set({ active: true })
        .where(eq(newsletterSubscribers.email, normalizedEmail))

      return NextResponse.json({ message: "Welcome back! You are now re-subscribed." })
    }

    await db.insert(newsletterSubscribers).values({
      email: normalizedEmail,
      active: true,
    })

    return NextResponse.json(
      { message: "Successfully subscribed to ARK Chronicles!" },
      { status: 201 }
    )
  } catch (error) {
    console.error("[Newsletter POST] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
