import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, verificationTokens } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const [user] = await db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1)

    // Always return success to avoid user enumeration
    if (!user) {
      return NextResponse.json(
        { message: "If an account exists with this email, a reset link has been sent." },
        { status: 200 }
      )
    }

    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 3600 * 1000) // 1 hour

    // Upsert token in verification_tokens
    await db
      .insert(verificationTokens)
      .values({
        identifier: normalizedEmail,
        token,
        expires,
      })
      .onConflictDoUpdate({
        target: verificationTokens.token,
        set: { token, expires },
      })

    // In production: send email with reset link
    // For now: log the link (replace with actual email service)
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/confirm?token=${token}&email=${normalizedEmail}`
    console.log("[Reset Password] Reset URL:", resetUrl)

    return NextResponse.json(
      { message: "If an account exists with this email, a reset link has been sent." },
      { status: 200 }
    )
  } catch (error) {
    console.error("[Reset Password] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
