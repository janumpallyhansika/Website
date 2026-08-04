"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react"

const ROLES = [
  { value: "member", label: "Member" },
  { value: "founder", label: "Founder" },
  { value: "investor", label: "Investor" },
  { value: "journalist", label: "Journalist" },
]

const COLLEGES = [
  "IIT Bombay",
  "IIT Delhi",
  "IIT Madras",
  "IIT Hyderabad",
  "BITS Pilani",
  "KLH Hyderabad",
  "IIM Ahmedabad",
  "IISC Bangalore",
]

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    role: "member",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Signup failed")
      } else {
        setSuccess(true)
        setTimeout(() => router.push("/login"), 2000)
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4">
        <div className="text-center">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-[#1B2A6B] mb-2">Welcome to ARK!</h2>
          <p className="text-gray-600">Your account has been created. Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-black">
              <span className="text-[#D4A017]">A.R.K</span>{" "}
              <span className="text-[#1B2A6B]">CHRONICLES</span>
            </h1>
            <p className="text-xs text-[#1B2A6B]/60 tracking-widest mt-0.5">
              ARCHITECTS OF RISING KNOWLEDGE
            </p>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-black text-[#1B2A6B] mb-1">Join ARK</h2>
          <p className="text-gray-500 text-sm mb-6">Create your account</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#1B2A6B] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Siddharth Verma"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] bg-[#F5F0E8]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1B2A6B] mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] bg-[#F5F0E8]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1B2A6B] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] bg-[#F5F0E8]/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1B2A6B] mb-1">
                College / Institution
              </label>
              <input
                type="text"
                value={form.college}
                onChange={(e) => update("college", e.target.value)}
                placeholder="e.g. IIT Bombay"
                list="colleges-list"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] bg-[#F5F0E8]/50"
              />
              <datalist id="colleges-list">
                {COLLEGES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1B2A6B] mb-1">
                I am a...
              </label>
              <select
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1B2A6B] bg-[#F5F0E8]/50"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1B2A6B] text-white rounded-xl font-bold text-sm hover:bg-[#1B2A6B]/90 transition flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#1B2A6B] font-semibold hover:text-[#D4A017]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
