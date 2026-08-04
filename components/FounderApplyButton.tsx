"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2, X } from "lucide-react"

export function FounderApplyButton() {
  const { data: session } = useSession()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: session?.user?.name || "",
    company: "",
    headline: "",
    bio: "",
    linkedinUrl: "",
    email: session?.user?.email || "",
  })

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session) {
      router.push("/login")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/founders", {
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
    <>
      <button
        onClick={() => (session ? setOpen(true) : router.push("/login"))}
        className="px-5 py-2.5 bg-[#D4A017] text-[#1B2A6B] font-bold text-sm rounded-full hover:bg-[#D4A017]/90 transition shrink-0"
      >
        Apply as Founder
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-black text-[#1B2A6B]">Apply as Founder</h2>
              <button onClick={() => setOpen(false)}>
                <X size={20} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {success ? (
              <div className="px-6 py-10 text-center">
                <p className="text-2xl font-black text-[#D4A017] mb-2">Applied!</p>
                <p className="text-gray-600 text-sm">
                  Your profile is under review. We&apos;ll notify you once it&apos;s approved.
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="mt-6 px-6 py-2.5 bg-[#1B2A6B] text-white rounded-full text-sm font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}
                {[
                  { label: "Full Name", field: "name", placeholder: "Aarav Bedi", required: true },
                  { label: "Company / Startup", field: "company", placeholder: "PulseForge AI", required: true },
                  { label: "Headline", field: "headline", placeholder: "Building lightweight AI copilots for industrial ops", required: false },
                  { label: "Email", field: "email", placeholder: "you@example.com", required: true },
                  { label: "LinkedIn URL", field: "linkedinUrl", placeholder: "https://linkedin.com/in/...", required: false },
                ].map(({ label, field, placeholder, required }) => (
                  <div key={field}>
                    <label className="block text-sm font-semibold text-[#1B2A6B] mb-1">{label}</label>
                    <input
                      type="text"
                      value={form[field as keyof typeof form]}
                      onChange={(e) => update(field, e.target.value)}
                      placeholder={placeholder}
                      required={required}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] bg-[#F5F0E8]/40"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-[#1B2A6B] mb-1">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => update("bio", e.target.value)}
                    placeholder="Tell us about your journey..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] bg-[#F5F0E8]/40 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#1B2A6B] text-white rounded-xl font-bold text-sm hover:bg-[#1B2A6B]/90 transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
