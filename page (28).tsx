"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Loader2, CheckCircle, TrendingUp } from "lucide-react"

const STAGES = ["Pre-seed", "Seed", "Series A", "Series B+", "Growth"]

export default function InvestorsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({
    investorName: session?.user?.name || "",
    email: session?.user?.email || "",
    company: "",
    startupName: "",
    stage: "",
    ask: "",
    pitch: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session) {
      router.push("/login?callbackUrl=/investors")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/investor-requests", {
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

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#1B2A6B]" style={{ fontFamily: "Georgia, serif" }}>
            Investors
          </h1>
          <p className="text-[#D4A017] font-semibold mt-1">
            Connect with ARK&apos;s verified investor network
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Info side */}
          <div>
            <div className="bg-[#1B2A6B] rounded-2xl p-8 text-white mb-6">
              <TrendingUp size={36} className="text-[#D4A017] mb-4" />
              <h2 className="text-2xl font-black mb-3">Connect with Capital</h2>
              <p className="text-white/70 text-sm leading-relaxed">
                ARK&apos;s investor network connects early-stage founders with active angels and
                institutional investors who understand the India builder ecosystem.
              </p>
            </div>
            <div className="space-y-3">
              {[
                "Direct introductions to verified investors",
                "Stage-appropriate matching",
                "No cold outreach — warm connections only",
                "Pitch review by ARK editorial team",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                  <span className="w-5 h-5 bg-[#D4A017] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[#1B2A6B] text-xs font-black">✓</span>
                  </span>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form side */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {success ? (
              <div className="text-center py-10">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-black text-[#1B2A6B] mb-2">Request Submitted!</h3>
                <p className="text-gray-600 text-sm">
                  Our team will review your request and connect you with relevant investors.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-black text-[#1B2A6B] mb-5">Submit Investor Request</h3>
                {!session && (
                  <div className="bg-[#1B2A6B]/5 border border-[#1B2A6B]/20 rounded-xl px-4 py-3 mb-5 text-sm text-[#1B2A6B]">
                    You&apos;ll need to{" "}
                    <a href="/login?callbackUrl=/investors" className="font-bold underline">
                      sign in
                    </a>{" "}
                    to submit.
                  </div>
                )}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { label: "Your Name", field: "investorName", placeholder: "Aarav Bedi" },
                    { label: "Email", field: "email", placeholder: "you@example.com", type: "email" },
                    { label: "Startup Name", field: "startupName", placeholder: "PulseForge AI" },
                    { label: "Your Company / Fund", field: "company", placeholder: "Accel, Angel etc." },
                  ].map(({ label, field, placeholder, type }) => (
                    <div key={field}>
                      <label className="block text-sm font-semibold text-[#1B2A6B] mb-1">{label}</label>
                      <input
                        type={type || "text"}
                        value={form[field as keyof typeof form]}
                        onChange={(e) => update(field, e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] bg-[#F5F0E8]/50"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-semibold text-[#1B2A6B] mb-1">Stage</label>
                    <select
                      value={form.stage}
                      onChange={(e) => update("stage", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] bg-[#F5F0E8]/50"
                    >
                      <option value="">Select stage...</option>
                      {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1B2A6B] mb-1">Funding Ask</label>
                    <input
                      type="text"
                      value={form.ask}
                      onChange={(e) => update("ask", e.target.value)}
                      placeholder="e.g. ₹50L for 10% equity"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] bg-[#F5F0E8]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1B2A6B] mb-1">One-line Pitch</label>
                    <textarea
                      value={form.pitch}
                      onChange={(e) => update("pitch", e.target.value)}
                      placeholder="We help X do Y by Z..."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] bg-[#F5F0E8]/50 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#1B2A6B] text-white rounded-xl font-bold text-sm hover:bg-[#1B2A6B]/90 transition flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    Submit Request
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
