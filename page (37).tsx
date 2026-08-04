"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Loader2, CheckCircle } from "lucide-react"

const CATEGORIES = [
  "Feature Stories",
  "Founder Stories",
  "Research Stories",
  "AI Articles",
  "Innovation Reports",
  "Editorials",
]

export default function SubmitStoryPage() {
  const { data: session } = useSession()
  const [form, setForm] = useState({
    title: "",
    authorName: session?.user?.name || "",
    email: session?.user?.email || "",
    college: "",
    linkedinUrl: "",
    category: "",
    content: "",
    imageUrl: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Submission failed")
      } else {
        setSuccess(true)
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F5F0E8]">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md px-4">
            <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-[#1B2A6B] mb-2">Story Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your story has been submitted for editorial review. We&apos;ll be in touch soon.
            </p>
            <Link
              href="/chronicles"
              className="px-6 py-3 bg-[#1B2A6B] text-white rounded-full font-bold text-sm"
            >
              Browse Chronicles
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#1B2A6B]" style={{ fontFamily: "Georgia, serif" }}>
            Submit a Story
          </h1>
          <p className="text-[#D4A017] font-semibold mt-1">
            Share your insight with India&apos;s builder community
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {!session && (
            <div className="bg-[#1B2A6B]/5 border border-[#1B2A6B]/20 rounded-xl px-4 py-3 mb-6 text-sm text-[#1B2A6B]">
              <Link href="/login" className="font-bold underline">Sign in</Link> to track your submissions and earn XP.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-[#1B2A6B] mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.authorName}
                  onChange={(e) => update("authorName", e.target.value)}
                  placeholder="Siddharth Verma"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] bg-[#F5F0E8]/50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1B2A6B] mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] bg-[#F5F0E8]/50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1B2A6B] mb-1">
                  College / Institution
                </label>
                <input
                  type="text"
                  value={form.college}
                  onChange={(e) => update("college", e.target.value)}
                  placeholder="IIT Bombay"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] bg-[#F5F0E8]/50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1B2A6B] mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={form.linkedinUrl}
                  onChange={(e) => update("linkedinUrl", e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] bg-[#F5F0E8]/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1B2A6B] mb-1">
                Story Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="What is your story about?"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] bg-[#F5F0E8]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1B2A6B] mb-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] bg-[#F5F0E8]/50"
              >
                <option value="">Select a category...</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1B2A6B] mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => update("imageUrl", e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] bg-[#F5F0E8]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1B2A6B] mb-1">
                Story Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.content}
                onChange={(e) => update("content", e.target.value)}
                placeholder="Write your story here... (Markdown or plain text)"
                required
                rows={12}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] bg-[#F5F0E8]/50 resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#1B2A6B] text-white rounded-xl font-bold text-sm hover:bg-[#1B2A6B]/90 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Submit for Review
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
