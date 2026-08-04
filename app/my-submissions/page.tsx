"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Loader2, Clock, CheckCircle, XCircle, FileText } from "lucide-react"

type Submission = {
  id: number
  title: string
  category: string | null
  status: "pending" | "approved" | "rejected"
  reviewNote: string | null
  createdAt: string
  articleId: number | null
}

const STATUS_CONFIG = {
  pending: { icon: Clock, color: "text-yellow-600 bg-yellow-50 border-yellow-200", label: "Under Review" },
  approved: { icon: CheckCircle, color: "text-green-600 bg-green-50 border-green-200", label: "Published" },
  rejected: { icon: XCircle, color: "text-red-600 bg-red-50 border-red-200", label: "Not Selected" },
}

export default function MySubmissionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/my-submissions")
      return
    }
    if (status === "authenticated") {
      fetch("/api/submissions?mine=true")
        .then((r) => r.json())
        .then((data) => setSubmissions(data.submissions || []))
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

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#1B2A6B]">My Submissions</h1>
            <p className="text-gray-500 text-sm mt-1">Track your story submissions and their status</p>
          </div>
          <Link
            href="/submit-story"
            className="px-5 py-2.5 bg-[#1B2A6B] text-white font-bold text-sm rounded-full hover:bg-[#1B2A6B]/90 transition"
          >
            + New Story
          </Link>
        </div>

        {submissions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <FileText size={40} className="text-[#1B2A6B]/20 mx-auto mb-4" />
            <h3 className="text-xl font-black text-[#1B2A6B] mb-2">No submissions yet</h3>
            <p className="text-gray-500 text-sm mb-6">
              Share your insights with India&apos;s builder community.
            </p>
            <Link
              href="/submit-story"
              className="inline-block px-6 py-3 bg-[#1B2A6B] text-white font-bold text-sm rounded-full hover:bg-[#1B2A6B]/90 transition"
            >
              Submit Your First Story
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => {
              const cfg = STATUS_CONFIG[sub.status]
              const StatusIcon = cfg.icon
              return (
                <div
                  key={sub.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#1B2A6B] text-base leading-snug mb-1 truncate">
                        {sub.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        {sub.category && (
                          <span className="px-2 py-0.5 bg-gray-100 rounded-full font-semibold">
                            {sub.category}
                          </span>
                        )}
                        <span>
                          {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.color} shrink-0`}
                    >
                      <StatusIcon size={12} />
                      {cfg.label}
                    </span>
                  </div>

                  {sub.reviewNote && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 font-semibold mb-0.5">Editorial Note:</p>
                      <p className="text-sm text-gray-700">{sub.reviewNote}</p>
                    </div>
                  )}

                  {sub.status === "approved" && sub.articleId && (
                    <div className="mt-3">
                      <Link
                        href={`/chronicles`}
                        className="text-sm font-bold text-[#D4A017] hover:underline"
                      >
                        View Published Article &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
