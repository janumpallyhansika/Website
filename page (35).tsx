"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Trophy, Flame, Star, Loader2 } from "lucide-react"

type Badge = {
  code: string
  name: string
  description: string | null
  minXp: number
  icon: string | null
}

type UserData = {
  name: string
  xp: number
  streak: number
  role: string
  badges: Badge[]
}

const XP_LEVELS = [
  { label: "Newcomer", min: 0, max: 99, color: "bg-gray-200 text-gray-600" },
  { label: "Contributor", min: 100, max: 499, color: "bg-blue-100 text-blue-700" },
  { label: "Builder", min: 500, max: 999, color: "bg-[#D4A017]/20 text-[#D4A017]" },
  { label: "Architect", min: 1000, max: 2499, color: "bg-[#1B2A6B]/20 text-[#1B2A6B]" },
  { label: "Legend", min: 2500, max: Infinity, color: "bg-purple-100 text-purple-700" },
]

function getLevel(xp: number) {
  return XP_LEVELS.find((l) => xp >= l.min && xp <= l.max) || XP_LEVELS[0]
}

export default function RewardsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/rewards")
      return
    }
    if (status === "authenticated") {
      fetch("/api/user/profile")
        .then((r) => r.json())
        .then((data) => setUserData(data))
        .catch(() => null)
        .finally(() => setLoading(false))
    }
  }, [status, router])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#1B2A6B]" />
      </div>
    )
  }

  const xp = userData?.xp || 0
  const streak = userData?.streak || 0
  const level = getLevel(xp)
  const nextLevel = XP_LEVELS.find((l) => l.min > xp)
  const progressPct = nextLevel
    ? Math.min(100, Math.round(((xp - level.min) / (nextLevel.min - level.min)) * 100))
    : 100

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#1B2A6B]" style={{ fontFamily: "Georgia, serif" }}>
            Rewards &amp; XP
          </h1>
          <p className="text-[#D4A017] font-semibold mt-1">
            Your ARK journey, tracked
          </p>
        </div>

        {/* XP Card */}
        <div className="bg-[#1B2A6B] rounded-2xl p-8 text-white mb-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-white/60 text-sm font-semibold">Welcome back,</p>
              <h2 className="text-2xl font-black">{userData?.name || session?.user?.name}</h2>
              <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold ${level.color}`}>
                {level.label}
              </span>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-[#D4A017]">{xp}</p>
              <p className="text-white/60 text-xs">Total XP</p>
            </div>
          </div>

          {/* Progress bar */}
          {nextLevel && (
            <div>
              <div className="flex justify-between text-xs text-white/60 mb-1">
                <span>{level.label}</span>
                <span>{nextLevel.label} at {nextLevel.min} XP</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D4A017] rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-xs text-white/50 mt-1">{nextLevel.min - xp} XP to next level</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#D4A017]/20 flex items-center justify-center">
              <Star size={22} className="text-[#D4A017]" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#1B2A6B]">{xp}</p>
              <p className="text-sm text-gray-500">Total XP</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <Flame size={22} className="text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#1B2A6B]">{streak}</p>
              <p className="text-sm text-gray-500">Day Streak</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1B2A6B]/10 flex items-center justify-center">
              <Trophy size={22} className="text-[#1B2A6B]" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#1B2A6B]">
                {userData?.badges?.length || 0}
              </p>
              <p className="text-sm text-gray-500">Badges Earned</p>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-black text-[#1B2A6B] mb-4">Your Badges</h2>
          {!userData?.badges || userData.badges.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Start reading articles and submitting stories to earn your first badge!
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {userData.badges.map((badge) => (
                <div
                  key={badge.code}
                  className="bg-[#F5F0E8] rounded-xl p-4 text-center"
                >
                  <div className="text-2xl mb-1">{badge.icon || "🏆"}</div>
                  <p className="font-bold text-[#1B2A6B] text-sm">{badge.name}</p>
                  {badge.description && (
                    <p className="text-xs text-gray-400 mt-0.5">{badge.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How to earn XP */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-black text-[#1B2A6B] mb-4">How to Earn XP</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { action: "Read an article", xp: "+5 XP" },
              { action: "Submit a story", xp: "+20 XP" },
              { action: "Story gets published", xp: "+50 XP" },
              { action: "Daily reading streak", xp: "+2 XP/day" },
              { action: "Founder profile approved", xp: "+30 XP" },
              { action: "Newsletter signup", xp: "+5 XP" },
            ].map((item) => (
              <div
                key={item.action}
                className="flex items-center justify-between bg-[#F5F0E8] rounded-xl px-4 py-3"
              >
                <span className="text-sm text-gray-700">{item.action}</span>
                <span className="text-sm font-black text-[#D4A017]">{item.xp}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
