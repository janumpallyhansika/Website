"use client"

import { useState } from "react"
import Link from "next/link"

export function Footer() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus("loading")

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus("success")
        setMessage(data.message)
        setEmail("")
      } else {
        setStatus("error")
        setMessage(data.error || "Something went wrong")
      }
    } catch {
      setStatus("error")
      setMessage("Network error. Please try again.")
    }
  }

  return (
    <footer className="bg-[#1B2A6B] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-black mb-1">
              <span className="text-[#D4A017]">A.R.K</span> CHRONICLES
            </h3>
            <p className="text-white/60 text-xs tracking-widest mb-4">
              ARCHITECTS OF RISING KNOWLEDGE
            </p>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Deep-dive startup analysis, regional tech briefs, and collegiate columns
              from builders across India.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4A017]"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-4 py-2 bg-[#D4A017] text-[#1B2A6B] font-semibold rounded-lg text-sm hover:bg-[#D4A017]/90 transition disabled:opacity-60"
              >
                {status === "loading" ? "..." : "Subscribe"}
              </button>
            </form>
            {message && (
              <p
                className={`text-xs mt-2 ${
                  status === "success" ? "text-green-400" : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}
          </div>

          {/* Nav links */}
          <div>
            <h4 className="font-semibold text-[#D4A017] mb-3 text-sm tracking-wide">
              EXPLORE
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              {[
                ["Chronicles", "/chronicles"],
                ["Founders", "/founders"],
                ["Investors", "/investors"],
                ["Magazines", "/magazines"],
                ["Research", "/research"],
                ["Opportunities", "/opportunities"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#D4A017] mb-3 text-sm tracking-wide">
              COMMUNITY
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              {[
                ["College Collabs", "/college-collabs"],
                ["Submit Story", "/submit-story"],
                ["About Us", "/about"],
                ["Rewards", "/rewards"],
                ["Login", "/login"],
                ["Join ARK", "/signup"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-xs">
            &copy; {new Date().getFullYear()} ARK Chronicles. All rights reserved.
          </p>
          <div className="flex gap-4 text-white/50 text-xs">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
