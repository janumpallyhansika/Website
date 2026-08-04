"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Loader2, CheckCircle, School } from "lucide-react"

export default function CollegeCollabsPage() {
  const [form, setForm] = useState({
    collegeName: "",
    contactName: "",
    email: "",
    websiteUrl: "",
    proposal: "",
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
      const res = await fetch("/api/college-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Application failed")
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
            College Collabs
          </h1>
          <p className="text-[#D4A017] font-semibold mt-1">
            Bring ARK Chronicles to your campus
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <div className="bg-[#1B2A6B] rounded-2xl p-8 text-white mb-6">
              <School size={36} className="text-[#D4A017] mb-4" />
              <h2 className="text-2xl font-black mb-3">Start an ARK Chapter</h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Partner with ARK to run a Chronicles chapter at your institution — publish stories,
                host events, and connect your campus builders to the national ARK network.
              </p>
            </div>
            <div className="space-y-3">
              {[
                "Official ARK Chronicles chapter branding",
                "Publish college-specific articles and research",
                "Access to ARK&apos;s investor and founder network",
                "Rewards and XP for your campus contributors",
                "Featured in ARK&apos;s regional publications",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                  <span className="w-5 h-5 bg-[#D4A017] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[#1B2A6B] text-xs font-black">✓</span>
                  </span>
                  <span className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: item }} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {success ? (
              <div className="text-center py-10">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-black text-[#1B2A6B] mb-2">Application Received!</h3>
                <p className="text-gray-600 text-sm">
                  Our college partnerships team will reach out within 3-5 business days.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-black text-[#1B2A6B] mb-5">Apply for a Collaboration</h3>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { label: "College / University Name", field: "collegeName", placeholder: "IIT Bombay", required: true },
                    { label: "Contact Person", field: "contactName", placeholder: "Your name", required: true },
                    { label: "Email", field: "email", placeholder: "contact@college.edu", required: true, type: "email" },
                    { label: "College Website", field: "websiteUrl", placeholder: "https://iitb.ac.in", required: false, type: "url" },
                  ].map(({ label, field, placeholder, required, type }) => (
                    <div key={field}>
                      <label className="block text-sm font-semibold text-[#1B2A6B] mb-1">
                        {label} {required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type={type || "text"}
                        value={form[field as keyof typeof form]}
                        onChange={(e) => update(field, e.target.value)}
                        placeholder={placeholder}
                        required={required}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] bg-[#F5F0E8]/50"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-semibold text-[#1B2A6B] mb-1">
                      How do you plan to use ARK?
                    </label>
                    <textarea
                      value={form.proposal}
                      onChange={(e) => update("proposal", e.target.value)}
                      placeholder="Describe your chapter proposal..."
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] bg-[#F5F0E8]/50 resize-none"
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
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
