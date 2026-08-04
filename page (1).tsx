"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import {
  Users,
  FileText,
  UserCheck,
  BookOpen,
  Loader2,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

type Stats = {
  totalUsers: number
  totalArticles: number
  pendingSubmissions: number
  pendingFounders: number
  totalMagazines: number
  newsletterSubscribers: number
}

type Submission = {
  id: number
  title: string
  authorName: string | null
  email: string | null
  category: string | null
  status: string
  createdAt: string
  content: string
}

type Founder = {
  id: number
  name: string
  company: string
  headline: string | null
  email: string | null
  status: string
  createdAt: string
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [stats, setStats] = useState<Stats | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [founders, setFounders] = useState<Founder[]>([])
  const [activeTab, setActiveTab] = useState<"submissions" | "founders" | "users">("submissions")
  const [loading, setLoading] = useState(true)
  const [reviewingId, setReviewingId] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [reviewNote, setReviewNote] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status === "authenticated") {
      if (session?.user?.role !== "admin") {
        router.push("/")
        return
      }
      loadData()
    }
  }, [status, session, router])

  async function loadData() {
    setLoading(true)
    try {
      const [statsRes, subsRes, foundersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/submissions?status=pending&limit=50"),
        fetch("/api/founders?status=pending"),
      ])
      const [statsData, subsData, foundersData] = await Promise.all([
        statsRes.json(),
        subsRes.json(),
        foundersRes.json(),
      ])
      setStats(statsData)
      setSubmissions(subsData.submissions || [])
      setFounders(foundersData.founders || [])
    } finally {
      setLoading(false)
    }
  }

  async function reviewSubmission(id: number, action: "approve" | "reject") {
    setReviewingId(id)
    try {
      const res = await fetch(`/api/submissions/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reviewNote }),
      })
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id))
        setExpandedId(null)
        setReviewNote("")
        setStats((prev) => prev ? { ...prev, pendingSubmissions: prev.pendingSubmissions - 1 } : prev)
      }
    } finally {
      setReviewingId(null)
    }
  }

  async function reviewFounder(id: number, action: "approve" | "reject") {
    setReviewingId(id)
    try {
      const res = await fetch(`/api/admin/founders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action === "approve" ? "approved" : "rejected" }),
      })
      if (res.ok) {
        setFounders((prev) => prev.filter((f) => f.id !== id))
        setStats((prev) => prev ? { ...prev, pendingFounders: prev.pendingFounders - 1 } : prev)
      }
    } finally {
      setReviewingId(null)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#1B2A6B]" />
      </div>
    )
  }

  const TABS = [
    { key: "submissions", label: "Submissions", count: stats?.pendingSubmissions },
    { key: "founders", label: "Founders", count: stats?.pendingFounders },
  ]

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#1B2A6B]">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">ARK Chronicles dashboard</p>
        </div>

        {/* Stats grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: "Users", value: stats.totalUsers, icon: Users },
              { label: "Articles", value: stats.totalArticles, icon: FileText },
              { label: "Pending Stories", value: stats.pendingSubmissions, icon: FileText, highlight: true },
              { label: "Pending Founders", value: stats.pendingFounders, icon: UserCheck, highlight: true },
              { label: "Magazines", value: stats.totalMagazines, icon: BookOpen },
              { label: "Subscribers", value: stats.newsletterSubscribers, icon: Users },
            ].map(({ label, value, icon: Icon, highlight }) => (
              <div
                key={label}
                className={`bg-white rounded-2xl p-4 shadow-sm border text-center ${
                  highlight ? "border-[#D4A017]/40" : "border-gray-100"
                }`}
              >
                <Icon size={18} className={`mx-auto mb-1.5 ${highlight ? "text-[#D4A017]" : "text-[#1B2A6B]/50"}`} />
                <p className="text-2xl font-black text-[#1B2A6B]">{value}</p>
                <p className="text-[10px] text-gray-400 font-semibold tracking-wide uppercase">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-[#1B2A6B] text-white"
                  : "bg-white text-[#1B2A6B] border border-gray-200 hover:border-[#1B2A6B]"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? "bg-white text-[#1B2A6B]" : "bg-[#D4A017] text-[#1B2A6B]"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Submissions tab */}
        {activeTab === "submissions" && (
          <div className="space-y-3">
            {submissions.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
                <CheckCircle size={36} className="text-green-400 mx-auto mb-3" />
                <p className="text-gray-500">No pending submissions. All caught up!</p>
              </div>
            ) : (
              submissions.map((sub) => (
                <div key={sub.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div
                    className="flex items-start justify-between gap-4 p-5 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#1B2A6B] leading-snug mb-1">{sub.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        {sub.authorName && <span className="font-semibold text-gray-600">{sub.authorName}</span>}
                        {sub.email && <span>{sub.email}</span>}
                        {sub.category && (
                          <span className="px-2 py-0.5 bg-gray-100 rounded-full">{sub.category}</span>
                        )}
                        <span>{new Date(sub.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); reviewSubmission(sub.id, "approve") }}
                        disabled={reviewingId === sub.id}
                        className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition"
                        title="Approve"
                      >
                        {reviewingId === sub.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); reviewSubmission(sub.id, "reject") }}
                        disabled={reviewingId === sub.id}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                        title="Reject"
                      >
                        <XCircle size={16} />
                      </button>
                      {expandedId === sub.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </div>

                  {expandedId === sub.id && (
                    <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{sub.content}</p>
                      <div>
                        <label className="block text-xs font-semibold text-[#1B2A6B] mb-1">Review Note (optional)</label>
                        <textarea
                          value={reviewNote}
                          onChange={(e) => setReviewNote(e.target.value)}
                          placeholder="Feedback for the author..."
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => reviewSubmission(sub.id, "approve")}
                          disabled={reviewingId === sub.id}
                          className="flex-1 py-2 bg-green-600 text-white font-bold text-sm rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-1"
                        >
                          <CheckCircle size={14} /> Approve & Publish
                        </button>
                        <button
                          onClick={() => reviewSubmission(sub.id, "reject")}
                          disabled={reviewingId === sub.id}
                          className="flex-1 py-2 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-1"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Founders tab */}
        {activeTab === "founders" && (
          <div className="space-y-3">
            {founders.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
                <CheckCircle size={36} className="text-green-400 mx-auto mb-3" />
                <p className="text-gray-500">No pending founder applications.</p>
              </div>
            ) : (
              founders.map((founder) => (
                <div key={founder.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#1B2A6B]/10 flex items-center justify-center font-black text-[#1B2A6B] shrink-0">
                      {founder.name[0]}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-[#1B2A6B]">{founder.name}</h3>
                      <p className="text-sm text-[#D4A017] font-semibold">{founder.company}</p>
                      {founder.headline && (
                        <p className="text-xs text-gray-500 mt-0.5">{founder.headline}</p>
                      )}
                      {founder.email && (
                        <p className="text-xs text-gray-400 mt-0.5">{founder.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => reviewFounder(founder.id, "approve")}
                      disabled={reviewingId === founder.id}
                      className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition"
                      title="Approve"
                    >
                      {reviewingId === founder.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    </button>
                    <button
                      onClick={() => reviewFounder(founder.id, "reject")}
                      disabled={reviewingId === founder.id}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                      title="Reject"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
